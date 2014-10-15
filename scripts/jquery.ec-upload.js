/**
 * Created by Mr.zhan on 14-10-15.
 * E-mail:mrzhanyouwei@163.com
 * jquery.ec-upload.js v1.0
 */
(function ($) {
    $.fn.ecuploader = function (options) {
        var crlf = '\r\n'; //换行
        var dashes = "--"; //分隔符
        var target = this; // 上传控件

        var settings = {
            "name": "", // 上传字段标识
            "fileType": null, // 上传文件类型 数组，默认不限制文件类型
            "postUrl": "", // 上传服务地址
            "onClientAbort": null, // 回调函数
            "onClientError": null, // 回调函数
            "onClientLoad": null, // 回调函数
            "onClientLoadEnd": null, // 回调函数
            "onClientLoadStart": null, // 回调函数
            "onClientProgress": null, // 回调函数
            "onServerAbort": null, // 回调函数
            "onServerError": null, // 回调函数
            "onServerLoad": null, // 回调函数
            "onServerLoadStart": null, // 回调函数
            "onServerProgress": null, // 回调函数
            "onServerReadyStateChange": null, // 回调函数
            "onSuccess": null, // 回调函数
            "onFileTypeError": null
        };

        if (options) {
            $.extend(settings, options);
        }

        return this.each(function (options) {
            var $this = $(this);
            if ($this.is("[type='file']")) {
                $this
                    .bind("change", function () {
                        var files = this.files;
                        for (var i = 0; i < files.length; i++) {
                            fileHandler(files[i]);
                        }
                    });
            } else {
                $this
                    .bind("dragenter dragover", function () {
//                        $(this).addClass("dropbox-hover");
                        $(this).css('border', '2px dashed #626060');
                        return false;
                    })
                    .bind("dragleave", function () {
                        $(this).css('border', '1px solid #ccc');
                        return false;
                    })
                    .bind("drop", function (e) {
                        $(this).css('border', '1px solid #ccc');
                        var files = e.originalEvent.dataTransfer.files;
                        console.log(files);
                        for (var i = 0; i < files.length; i++) {
                            fileHandler(files[i]);
                        }
                        return false;
                    });
            }
        });

        function fileHandler(file) {
            var typeFlag = false;
            if (settings.fileType) {
                for (var i = 0; i < settings.fileType.length; i++) {
                    if (file.type === settings.fileType[i]) {
                        typeFlag = true;
                    }
                }
            } else {
                typeFlag = true;
            }

            if (!typeFlag && settings.onFileTypeError) {
                settings.onFileTypeError(file);
                return;
            }


            var fileReader = new FileReader();
//            读取操作终止回调函数
            fileReader.onabort = function (e) {
                if (settings.onClientAbort) {
                    settings.onClientAbort(e, file);
                }
            };
//            读取错误回调函数
            fileReader.onerror = function (e) {
                if (settings.onClientError) {
                    settings.onClientError(e, file);
                }
            };
//            读取操作成功回调函数
            fileReader.onload = function (e) {
                if (settings.onClientLoad) {
                    settings.onClientLoad(e, file);
                }
            };
//            读取操作结束回调函数
            fileReader.onloadend = function (e) {
                if (settings.onClientLoadEnd) {
                    settings.onClientLoadEnd(e, file);
                }
            };
//            读取操作开始回调函数
            fileReader.onloadstart = function (e) {
                if (settings.onClientLoadStart) {
                    settings.onClientLoadStart(e, file);
                }
            };
//            读取操作进度回调函数
            fileReader.onprogress = function (e) {
                if (settings.onClientProgress) {
                    settings.onClientProgress(e, file);
                }
            };
            fileReader.readAsDataURL(file);

            var xmlHttpRequest = new XMLHttpRequest();
//            上传终止回调函数
            xmlHttpRequest.upload.onabort = function (e) {
                if (settings.onServerAbort) {
                    settings.onServerAbort(e, file);
                }
            };
//            上传发生错误回调函数
            xmlHttpRequest.upload.onerror = function (e) {
                if (settings.onServerError) {
                    settings.onServerError(e, file);
                }
            };
//            上传成功回调函数
            xmlHttpRequest.upload.onload = function (e) {
                if (settings.onServerLoad) {
                    settings.onServerLoad(e, file);
                }
            };
//            开始上传回调函数
            xmlHttpRequest.upload.onloadstart = function (e) {
                if (settings.onServerLoadStart) {
                    settings.onServerLoadStart(e, file);
                }
            };
//            上传进度回调函数
            xmlHttpRequest.upload.onprogress = function (e) {
                if (settings.onServerProgress) {
                    settings.onServerProgress(e, file);
                }
            };
//            服务器端相应状态回调函数
            xmlHttpRequest.onreadystatechange = function (e) {

                if (settings.onServerReadyStateChange) {
                    settings.onServerReadyStateChange(e, file, xmlHttpRequest.readyState);
                }
                if (settings.onSuccess && xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                    settings.onSuccess(e, file, xmlHttpRequest);

                }

            };
            xmlHttpRequest.open("POST", settings.postUrl, true);//上传附件接口

            if (file.getAsBinary) { // Firefox浏览器上传
                var data = dashes + crlf +
                    "Content-Disposition: form-data;" +
                    "name=\"" + settings.name + "\";" +
                    "filename=\"" + unescape(encodeURIComponent(file.name)) + "\"" + crlf +
                    "Content-Type: application/octet-stream" + crlf + crlf +
                    file.getAsBinary() + crlf +
                    dashes + dashes;

                xmlHttpRequest.setRequestHeader("Content-Type", "multipart/form-data;");
                xmlHttpRequest.sendAsBinary(data);

            } else if (window.FormData) { // Chrome IE浏览器上传
                var formData = new FormData();
                formData.append(settings.name, file);
                xmlHttpRequest.send(formData);
            }
        }
    };
})(jQuery);