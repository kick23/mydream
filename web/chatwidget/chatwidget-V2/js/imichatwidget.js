;
(function ($) {
    $.fn.extend({
        donetyping: function (callback, timeout) {
            timeout = timeout || 1e3; // 1 second default timeout
            var timeoutReference,
                doneTyping = function (el) {
                    if (!timeoutReference)
                        return;
                    timeoutReference = null;
                    callback.call(el);
                };
            return this.each(function (i, el) {
                var $el = $(el);
                // Chrome Fix (Use keyup over keypress to detect backspace)
                // thank you @palerdot
                $el.on('keyup keypress paste', function (e) {
                    // This catches the backspace button in chrome, but also prevents
                    // the event from triggering too preemptively. Without this line,
                    // using tab/shift+tab will make the focused element fire the callback.
                    if (e.type == 'keyup' && e.keyCode != 8)
                        return;

                    // Check if timeout has been set. If it has, "reset" the clock and
                    // start over again.
                    if (timeoutReference)
                        clearTimeout(timeoutReference);
                    timeoutReference = setTimeout(function () {
                        // if we made it here, our timeout has elapsed. Fire the
                        // callback
                        doneTyping(el);
                    }, timeout);
                }).on('blur', function () {
                    // If we can, fire the event since we're leaving the field
                    doneTyping(el);
                });
            });
        }
    });
})(jQuery);
var IMIwidget = function () {
    var ProfileUrl = "http://dev.imichat.co/imichatapi/";     
   // var ProfileUrl = "http://localhost:58216/";
    var domainName = "http://widget.imichat.co/chatwidget-V2/";
    var emojiImageURL = "http://widget.imichat.co/chatwidget/sheets/sheet_emojione_64_indexed_128.png";

    var ticks = new Date().getTime();

    var topic = "imichat";
    var threadname = "imichat";
    var threadid = "";
    var validDomain = "false";
    var showprevhistory = true;
    var wcindiflag = true;
    var counter = 0;
    var tt = "";
    var GetWidgetStyle = function () {
        try {
            var profileAPI = ProfileUrl + "profile/GetWebchatStyles?teamappid=" + IMIwidget.clientId() + "&$callback=?";
            $.ajax({
                url: profileAPI,
                type: "POST",
                data: {},
                dataType: "jsonp",
                contentType: "text/plain",
                success: function (data) {
                    console.log("success:" + data);
                    //return data;
                },
                error: function (jqXHR, textStatus) {
                    try {
                        console.log(jqXHR);
                        //alert(data);
                    } catch (e) { }
                }
            });
        } catch (e) { }
    };

    var GetAppId = function (id) {
        // IMIwidget.setSession("appid", "CH25153419icweStart");
        // IMIwidget.setSession("appkey", "2HpnSy9R");
    };
    var RegisterUser = function () {
        $(".error").html("");
        var errFlag = false;
        if ($.trim($("#icwname").val()) == "") {
            $("#icweName").html("Please enter name");
            errFlag = true;
        } else {
            $("#icweName").html("");
        }
        if ($.trim(localStorage.getItem("browserfingerprint")) == "") {
            $("#icweEmail").html("Please enter email id");
            errFlag = true;
        } else if (!IMIwidget.validateEmail(($.trim(localStorage.getItem("browserfingerprint"))))) {
            $("#icweEmail").html("Please enter valid email id");
            errFlag = true;
        } else {
            $("#icweEmail").html("");
        }
        if ($.trim($("#icwmobile").val()) != "") {
            if (!IMIwidget.validateMobile(($.trim($("#icwmobile").val())))) {
                $("#icweMobile").html("Please enter valid phone number");
                errFlag = true;
            }
        } else {
            $("#icweMobile").html("");
        }
        if (errFlag)
            return;
            $("#icwemail").val( localStorage.getItem("browserfingerprint"));
        $("#icwemail").val(localStorage.getItem("browserfingerprint").toLowerCase());
        $("#newconv").attr('disabled', true);
        $("#newconv").removeAttr('onclick');

        var pdata = "{\"customerid\": \"" + $.trim(localStorage.getItem("browserfingerprint")) + "\",\"email\": \"" + $.trim(localStorage.getItem("browserfingerprint")) + "\",\"name\": \"" + $.trim($("#icwname").val()) + "\",\"hostname\": \"" + IMIwidget.getDomain() + "\",\"mobileno\": \"" + $.trim($("#icwmobile").val()) + "\",\"teamappid\":\"" + IMIwidget.clientId() + "\"}";
        var profileAPI = ProfileUrl + "profile/create?jsonPcallback=?&data=" + pdata;
        $("#newconv").text("Please wait..");

        $.getJSON(profileAPI, function (result) { });

    };
    var RegisterRTM = function () {
        var config = new IMI.ICConfig(IMIwidget.appId(), IMIwidget.appkey());
        IMI.IMIconnect.startup(config);
         $("#icwemail").val(localStorage.getItem("browserfingerprint"));
         var userId =localStorage.getItem("browserfingerprint");
        var deviceId = ""; //$("#deviceId").val();

        if (deviceId === "") {
            deviceId = IMI.ICDeviceProfile.getDefaultDeviceId();
        }
        console.log("deviceId:" + deviceId);
        deviceProfile = new IMI.ICDeviceProfile(deviceId, userId);

        console.log("userId:" + userId);
        console.log("IMIwidget.appId():" + IMIwidget.appId());
        //console.log("IMIwidget.appkey():" + IMIwidget.appkey());
        //var isRegistered = IMI.IMIconnect.isRegistered();
        //console.log(isRegistered);
        var regcallback = {
            onSuccess: function (msg) {
                var messaging = IMI.ICMessaging.getInstance();
                messaging.connect();
                console.log("conneted");
                threadid = userId + "_" + IMIwidget.clientId() + "_"+new Date().getTime();
                topic=threadid;
                CreateThread();
                /*
                if (localStorage.getItem(userId + "_" + IMIwidget.clientId() + "_threadid") != null && localStorage.getItem(userId + "_" + IMIwidget.clientId() + "_threadid") != "") {
                    threadid = localStorage.getItem(userId + "_" + IMIwidget.clientId() + "_threadid");
                    IMIwidget.setCookie(IMIwidget.clientId() + "_email", localStorage.getItem("browserfingerprint").toLowerCase());
                    IMIwidget.setCookie(IMIwidget.clientId() + "_username", $("#icwname").val());
                    IMIwidget.setCookie(IMIwidget.clientId() + "_mobno", $("#icwmobile").val());
                    LaodChatWindow();
                } else {
                    FetchThreads();
                }*/
            },
            onFailure: function (err) {
                console.log(err);
                //enableStart("unable to connect");
                IMIwidget.startErrMsg("unable to connect");
            }
        };
        //if (!isRegistered) {
        //  IMI.IMIconnect.register($.trim(localStorage.getItem("browserfingerprint")), callback);
        IMI.IMIconnect.register(deviceProfile, regcallback);
        //}
    };
    var CreateThread = function () {
      
        //var steamid = IMIwidget.getTopic();
        //var threadtitle = IMIwidget.getThreadName();
        var userId = localStorage.getItem("browserfingerprint");
        var messaging = IMI.ICMessaging.getInstance();
        var createThreadCallBack = {
            onSuccess: function (thread) {
                
                if (thread) {
                    threadid = thread.getId();
                    localStorage.setItem(userId + "_" + IMIwidget.clientId() + "_threadid", threadid);
                    LaodChatWindow();
                } else {
                    console.log("failed to CreateThread:");
                    IMIwidget.startErrMsg("unable to connect");
                }
            },
            onFailure: function () {
                console.log("failed to CreateThread:");
                IMIwidget.startErrMsg("unable to connect");
            }

        };

        //messaging.createThread(steamid, threadtitle, createThreadCallBack);
        var threadObj = new IMI.ICThread();
        threadObj.setTitle(IMIwidget.getThreadName());
        threadObj.setType(IMI.ICThreadType.Conversation);
        messaging.createThread(threadObj, createThreadCallBack);

    };
    var FetchThreads = function () {
        var userId = localStorage.getItem("browserfingerprint").toLowerCase();
        var messaging = IMI.ICMessaging.getInstance();
        var threadsCallback = {
            onSuccess: function (threads) {
                var html = [];
                debugger;
                console.log(threads);
                if (threads && threads.length > 0) {
                    var threadfound = 0;
                    for (var stInd = 0; stInd < threads.length; stInd++) {
                        var strObj = threads[stInd];
                        if (strObj.getTitle() == IMIwidget.getThreadName()) {
                            threadid = strObj.id;
                            localStorage.setItem(userId + "_" + IMIwidget.clientId() + "_threadid", threadid);
                            LaodChatWindow();
                            threadfound = 1;
                            break;
                        }
                    }
                    if (threadfound == 0) {
                        CreateThread();
                    }

                } else {
                    CreateThread();
                }
                // $(".threadsList").html(html.join(" "));
            },
            onFailure: function (error) {
                console.log("failed to get threads");
                //handleFailure(error);
            }

        };
        messaging.fetchThreads(0, threadsCallback);


    };
    var LaodChatWindow = function () {
        ReciveMsg();
        $('.chatwindow1').hide();
        $('.chatwindow2').show();
        $("#newconv").attr('disabled', false);
        $('#newconv').attr('onClick', 'IMIwidget.registeruser()');
        //alert($('.wdt-emoji-picker').length);
        $("#addClass").removeClass('state1');
        $("#addClass").addClass('state2');
        $("#hdnicwagent").val("");
        $("#icwdivcarea").html("");
        $("#icweStart").text("");
        var appid = IMIwidget.appId();
        IMIwidget.setSession(IMIwidget.clientId() + "_name", $("#icwname").val());
        IMIwidget.setSession(IMIwidget.clientId() + "_email", localStorage.getItem("browserfingerprint").toLowerCase());
        IMIwidget.setSession(IMIwidget.clientId() + "_mobile", $("#icwmobile").val());
        //$("#icwagenthdr").html($("#icwname").val());
        //$("#icwagenthdr").html(jData.response.data.oraganization);
        localStorage.setItem("imichatappid", appid);
        //$('#newconv').text($('#newconv').attr('data-text'));
        if ($('#newconv').attr('data-text') == undefined || $('#newconv').attr('data-text') == null || $('#newconv').attr('data-text') == "") {
            $('#newconv').text("Start Chat");
        } else {
            $('#newconv').text($('#newconv').attr('data-text'));
        }
        IMIwidget.loadPlugins();
        // IMIwidget.bindPrevData();
        if (IMIwidget.getshowprevhist()) {
            // GetMesssageThread();
            IMIwidget.GetWCPreviousHistory();
        }
    };
    var ReciveMsg = function () {

        var messaging1 = IMI.ICMessaging.getInstance();
        var icMsgRecrCallback = new IMI.ICMessagingReceiver();
        icMsgRecrCallback.onConnectionStatusChanged = function (status) {
            console.log("read connect status, based on status do operations:" + status);
        };
        icMsgRecrCallback.onMessageReceived = function (icMessage) {
            if (icMessage.extras.customtags.browserfingerprint != localStorage.getItem("browserfingerprint")) {
                console.log("diff browser id");
                return;
            }
            console.log("read message from icMessage obj");
            console.log(icMessage.userId);
            console.log(icMessage.getMessage());
            console.log(icMessage.getMedia());
            console.log(icMessage.getType());
            if (icMessage.getType() === IMI.ICMessageType.Republish) {
                var thread = icMessage.getThread() || {};
                if (icMessage.getMessage().indexOf("$$$$$ILOG$$$$$|") === 0) {
                    //closed
                    IMIwidget.bindIlogMsg(message.getMessage(), "MSG", true);

                } else if (icMessage.getMessage() === "$$$$CLOSECHAT$$$$") {
                    //closed
                    IMIwidget.bindCloseMsg("Close", "MSG", false);

                } else {
                    if (icMessage.getMedia()) {
                        var html = [];
                        var media = icMessage.getMedia();
                        for (var i = 0; i < media.length; i++) {
                            var m = media[i];
                            var contentType = m.getContentType();
                            var url = m.getURL();
                            IMIwidget.bindMT("attachment|||" + contentType + "|||" + url, IMIwidget.getUserTimezoneDateTime(icMessage.submittedAt), icMessage.transactionId, false);

                        }
                        // if ($("#dicw_" + message.getTransactionId()).length === 0) {
                        if (document.getElementById("dicw_" + icMessage.getTransactionId()) == null) {
                            IMIwidget.bindMT(icMessage.getMessage(), IMIwidget.getUserTimezoneDateTime(icMessage.submittedAt), icMessage.transactionId, false);
                        }
                    } else {
                        //if ($("#dicw_" + message.getTransactionId()).length === 0) {
                        if (document.getElementById("dicw_" + icMessage.getTransactionId()) == null) {
                            IMIwidget.bindMT(icMessage.getMessage(), IMIwidget.getUserTimezoneDateTime(icMessage.submittedAt), icMessage.transactionId, false);
                        }
                    }
                }
            } else {
                try {
                    if (icMessage.userId == IMIwidget.getUserId()) {
                        var agentid = icMessage.extras.customtags.agent;
                        var teamname = IMIwidget.getSession("teamname");
                        if (icMessage.extras.customtags.teamname != null) {
                            teamname = icMessage.extras.customtags.teamname;
                        }
                        if (agentid.length > 0) {
                            if ($("#hdnicwagent").val() != agentid) {
                                IMIwidget.bindMsg(agentid, "MSG", teamname, false);
                                IMIwidget.addLocal(agentid, "", "", "MSG");
                                $("#icwagenthdr").html("<span class=\"icon-headset\"></span> " + agentid);
                                $("#hdnicwagent").val(agentid);
                            }
                        }
                    }
                } catch (e) { }
                try {
                    if (icMessage.getMedia() != null || icMessage.getMedia() != undefined) {
                        var fileList = icMessage.getMedia();
                        for (var x = 0; x < fileList.length; x++) {
                            var fi = fileList[x];
                            IMIwidget.bindMO("attachment|||" + fi.getContentType() + "|||" + fi.getURL(), IMIwidget.getUserCtime(), x + icMessage.transactionId, false);
                            IMIwidget.addLocal("attachment|||" + fi.getContentType() + "|||" + fi.getURL(), IMIwidget.getUserCtime(), x + icMessage.transactionId, "MO");
                        }
                    }
                } catch (e) { }
                if (icMessage.getMessage().indexOf("$$$$$ILOG$$$$$|") === 0) {
                    IMIwidget.bindIlogMsg(icMessage.getMessage(), "MSG", false);
                } else if (icMessage.getMessage() == "$$$$$TYPING$$$$$") {
                    if (icMessage.extras.customtags.typing == "typing_on") {
                        IMIwidget.bindTypingMO("typing_on", false);
                        counter = 0;
                        tt = setInterval(function () {
                            startTime();
                        }, 1000);
                    } else if (icMessage.extras.customtags.typing == "typing_off") {
                        $(".divtypingindicator").remove();
                    }
                } else {
                    IMIwidget.bindMO(icMessage.getMessage(), IMIwidget.getUserCtime(), icMessage.transactionId, false);
                }
                IMIwidget.addLocal(icMessage.getMessage(), IMIwidget.getUserCtime(), icMessage.transactionId, "MO");
                // if (message.getType() === IMI.ICMessageType.ReadReceipt) {
                // messaging1.setMessagesAsRead(icMessage.transactionId, callback);}//for read receipt
                var callback = {
                    onSuccess: function () {
                        console.log("dr:success");

                    },
                    onFailure: function (errormsg) {
                        console.log("bindmtdr:failed ");
                    }

                };
            }
        };

        messaging1.setICMessagingReceiver(icMsgRecrCallback);
    };
    var startTime = function () {
        if (counter == 10) {
            $(".divtypingindicator").remove();
            clearInterval(tt);
        } else {
            counter++;
        }
    };
    var SendMessage = function () {

        if ($.trim($("#icwmsg").val()) == "") {
            $("#icweMsg").html("Please enter message");
            return;
        } else {
            $("#icweMsg").html("");
        }
        $("#sendloading").css("display", "block");
        $("#aSend").css("display", "none");

        var validateAPI = ProfileUrl + "profile/validate?hostname=" + IMIwidget.getDomain() + "&teamappid=" + IMIwidget.clientId() + "&$callback=?";

        $.ajax({
            url: validateAPI,
            type: "POST",
            data: {},
            dataType: "jsonp",
            jsonp: "$callback",
            success: function (data) {
                console.log("validatedomain success:" + data);
                //return data;
            },
            error: function (data) {
                console.log(data);
                //alert(data);
                return data;
            }

        });

    };
    var SendFile = function (url, type) {
        //  if ($.trim($("#icwmsg").val()) == "") { $("#icweMsg").html("Please enter message"); return; } else { $("#icweMsg").html(""); }
        var messaging = IMI.ICMessaging.getInstance();
        console.log(messaging);
        var message = new IMI.ICMessage();
        // message.setMessage("attachment");
        var attachements = [];
        var media = new IMI.ICMediaFile();
        media.contentType = type;
        media.url = url;
        attachements.push(media);
        //message.setMedia = attachements;
        message.setMedia(attachements);
        //  message.setTopic(IMIwidget.getTopic());

        var thread = new IMI.ICThread();
        thread.setId(IMIwidget.getThreadid());
        thread.setTitle(IMIwidget.getThreadName());
        thread.setType(IMI.ICThreadType.Conversation);
        ///thread.setStreamName(IMIwidget.getTopic());
        message.setThread(thread);

        var callback = {
            onSuccess: function (msg) {
                console.log("message sent");
                IMIwidget.bindMT("attachment|||" + type + "|||" + url, IMIwidget.getUserCtime(), new Date().getTime(), false);
                IMIwidget.addLocal("attachment|||" + type + "|||" + url, IMIwidget.getUserCtime(), new Date().getTime(), "MT");

                $("#icwmsg").val("");
                $("#icweMsg").html("");
            },
            onFailure: function (errormsg) {
                $("#icweMsg").html("failed to send message");
                console.log("failed to send message");
                console.log(errormsg);
            }

        };
        console.log(messaging.isConnected());
        try {
            var appid = IMIwidget.clientId();
            var a = document.createElement('a');
            a.href = window.document.referrer;

            var jobj = {
                "name": IMIwidget.getSession(appid + "_name"),
                "Webpage": window.document.referrer.match(/[^\/]+$/)[0],
                "Website": a.hostname,
                "mobileno": IMIwidget.getSession(appid + "_mobile"),
                "emailid": IMIwidget.getSession(appid + "_email"),
                "browserfingerprint": localStorage.getItem("browserfingerprint"),
            };
            message.setExtras(jobj);
            console.log(message);
        } catch (e) {
            console.log(e.message);
        }

        messaging.publishMessage(message, callback);
    };
    var Confirm = function () {
        try {
            $("#divmodalbody").html('');
            $("#divmodalbody").append("<p>Are you sure you want to end this chat?</p>");
            $("#divtscriptfooter").css("display", "block");
            $('#emailtranscript').modal();

        } catch (e) { }
    };
    var CloseChat = function () {
        try {
            $('#emailtranscript').modal('hide');
            if ($(".wdt-emoji-picker").hasClass("wdt-emoji-picker-open")) {
                $(".wdt-emoji-picker").removeClass("wdt-emoji-picker-open");
                $(".wdt-emoji-popup").removeClass("open");
                $(".icon-happy").removeClass("active");
                $(".error").html("");
            }
        } catch (y) { }
        var messaging = IMI.ICMessaging.getInstance();
        console.log(messaging);
        var message = new IMI.ICMessage();
        message.setMessage("$$$$CLOSECHAT$$$$");
        //message.setTopic(IMIwidget.getTopic());

        var thread = new IMI.ICThread();
        thread.setId(IMIwidget.getThreadid());
        thread.setTitle(IMIwidget.getThreadName());
        // thread.setStreamName(IMIwidget.getTopic());
        thread.setType(IMI.ICThreadType.Conversation);
        message.setThread(thread);

        var callback = {
            onSuccess: function (msg) {
                console.log("close message sent");
                IMIwidget.bindMT($("#icwmsg").val(), IMIwidget.getUserCtime(), new Date().getTime(), false);
                IMIwidget.addLocal($("#icwmsg").val(), IMIwidget.getUserCtime(), new Date().getTime(), "MT");
                $("#icwmsg").val("");
                $(".error").html("");
                //var startbuttontext = IMIwidget.getSession("buttontext");
                $("#newconv").text($('#newconv').attr('data-text'));
                IMIwidget.clearSession();
                sessionStorage.setItem("data-bind", IMIwidget.getQueryString(location.href, "id"));
                sessionStorage.setItem("data-org", IMIwidget.getQueryString(location.href, "org"));
                $('.chatwindow2').fadeToggle(200, 'linear');
                $('.open-btn').addClass('close-btn');
                $('.chatwindow1').show();
                $('.chatwindow2').hide();
                $("#addClass").addClass('state1');
                $("#addClass").removeClass('state2');

                IMIwidget.deleteCookie(IMIwidget.clientId() + "_username");
                IMIwidget.deleteCookie(IMIwidget.clientId() + "_email");
                IMIwidget.deleteCookie(IMIwidget.clientId() + "_mobno");

            },
            onFailure: function (errormsg) {
                console.log("failed to close chat");
                console.log(errormsg);
                //var startbuttontext = IMIwidget.getSession("buttontext");
                $("#newconv").text($('#newconv').attr('data-text'));

            }

        };
        console.log(messaging.isConnected());
        messaging.publishMessage(message, callback);
    };
    var GetMesssageThread = function () {
        var messaging = IMI.ICMessaging.getInstance();
        var messagesCallBack = {
            onSuccess: function (messages) {
                if (messages && messages.length > 0) {
                    $.each(messages, function (key) {
                        try {
                            var message = messages[key];

                            if (message.getType() === IMI.ICMessageType.Message) {
                                var thread = message.getThread() || {};
                                if (message.getMedia()) {
                                    var html = [];
                                    var media = message.getMedia();
                                    for (var i = 0; i < media.length; i++) {
                                        var m = media[i];
                                        var contentType = m.getContentType();
                                        var url = m.getURL();
                                        IMIwidget.bindMO("attachment|||" + contentType + "|||" + url, IMIwidget.getUserTimezoneDateTime(message.submittedAt), message.transactionId, true);

                                    }

                                    //if ($("#dicw_" + message.getTransactionId()).length === 0) {
                                    if (document.getElementById("dicw_" + message.getTransactionId()) == null) {
                                        IMIwidget.bindMO(message.getMessage(), IMIwidget.getUserTimezoneDateTime(message.submittedAt), message.transactionId, true);
                                    }

                                } else {
                                    // if ($("#dicw_" + message.getTransactionId()).length === 0) {
                                    if (document.getElementById("dicw_" + message.getTransactionId()) == null) {
                                        IMIwidget.bindMO(message.getMessage(), IMIwidget.getUserTimezoneDateTime(message.submittedAt), message.transactionId, true);
                                    }
                                }

                            } else if (message.getType() === IMI.ICMessageType.Republish) {
                                var thread1 = message.getThread() || {};

                                if (message.getMessage().indexOf("$$$$$ILOG$$$$$|") === 0) {
                                    //closed
                                    IMIwidget.bindIlogMsg(message.getMessage(), "MSG", true);

                                } else if (message.getMessage() === "$$$$CLOSECHAT$$$$") {
                                    //closed
                                    IMIwidget.bindCloseMsg("Close", "MSG", true);

                                } else {
                                    if (message.getMedia()) {
                                       
                                        var media1 = message.getMedia();
                                        for (var x = 0; x < media1.length; x++) {
                                            var m1 = media1[x];
                                            var contentType1 = m1.getContentType();
                                            var url1 = m1.getURL();
                                            IMIwidget.bindMT("attachment|||" + contentType1 + "|||" + url1, IMIwidget.getUserTimezoneDateTime(message.submittedAt), message.transactionId, true);

                                        }
                                        // if ($("#dicw_" + message.getTransactionId()).length === 0) {
                                        if (document.getElementById("dicw_" + message.getTransactionId()) == null) {
                                            IMIwidget.bindMT(message.getMessage(), IMIwidget.getUserTimezoneDateTime(message.submittedAt), message.transactionId, true);
                                        }
                                    } else {
                                        //if ($("#dicw_" + message.getTransactionId()).length === 0) {
                                        if (document.getElementById("dicw_" + message.getTransactionId()) == null) {
                                            IMIwidget.bindMT(message.getMessage(), IMIwidget.getUserTimezoneDateTime(message.submittedAt), message.transactionId, true);
                                        }
                                    }
                                }
                            }

                        } catch (e) { }
                        setTimeout(function () {
                            $('#chat').scrollTop($('#chat')[0].scrollHeight);
                        }, 100);

                    });

                }

            },
            onFailure: function () {
                console.log("failed to get messages");
            }

        };
        messaging.fetchMessages(IMIwidget.getThreadid(), "", messagesCallBack);
    };
    var wcindicator = function (e, ctrl) {
        var length = $(ctrl).val().length;
        if (wcindiflag && length > 4) {
            setwcindicator("typing_on");
            wcindiflag = false;
        }
    };
    var wcindicatorclear = function () {
        if (!wcindiflag) {
            setwcindicator("typing_off");
            wcindiflag = true;
        }
    };
    var setwcindicator = function (sender_action) {
        try {
            if ($.trim($("#icwmsg").val()) == "") {
                return;
            }
            var postData = "hostname=" + IMIwidget.getDomain() + "&teamappid=" + IMIwidget.clientId() + "&email=" + IMIwidget.getUserId() + "&istyping=" + sender_action + "&appid=" + IMIwidget.appId() + "&threadid=" + IMIwidget.getThreadid();
            var validateAPI = ProfileUrl + "profile/GetTypingIndicator?" + postData + "&$callback=?";
            $.ajax({
                url: validateAPI,
                type: "POST",
                data: {},
                dataType: "jsonp",
                jsonp: "$callback",
                success: function (data) {
                    console.log("sending typing indicator success:" + data);
                    //return data;
                },
                error: function (data) {
                    console.log(data);
                    //alert(data);
                    return data;
                }

            });
        } catch (e) { }
    };
    var GetWCPreviousHistory = function () {
        try {
            var browserfingerprint = localStorage.getItem("browserfingerprint");
            browserfingerprint = (browserfingerprint == undefined || browserfingerprint == "") ? "" : localStorage.getItem("browserfingerprint");
            var postData = "teamappid=" + IMIwidget.clientId() + "&email=" + IMIwidget.getUserId() + "&browserfingerprint=" + browserfingerprint + "&appid=" + IMIwidget.appId() + "&threadid=" + IMIwidget.getThreadid();
            var validateAPI = ProfileUrl + "profile/GetPreviousChatHistory?" + postData;
            $.ajax({
                url: validateAPI,
                type: "GET",
                data: {},
                success: function (data) {
                    if (data != null && data.length > 0) {
                        data = $.parseJSON(data);
                        $.each(data, function (key) {
                            try {
                                var message = data[key];
                                if (message.ALIASFILTER == localStorage.getItem("browserfingerprint")) {
                                    if (message.CHATTYPE == "MO") {
                                        if (message.CONTENTTYPE != "" && message.PATH != "") {
                                            IMIwidget.bindMT("attachment|||" + message.CONTENTTYPE + "|||" + message.PATH, IMIwidget.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false);
                                        }
                                        IMIwidget.bindMT(message.MSG, IMIwidget.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false);
                                    }
                                    if (message.CHATTYPE == "MT" || message.CHATTYPE == "OO" || message.CHATTYPE == "AR") {
                                        if (message.CONTENTTYPE != "" && message.PATH != "") {
                                            IMIwidget.bindMO("attachment|||" + message.CONTENTTYPE + "|||" + message.PATH, IMIwidget.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false);
                                        }
                                        IMIwidget.bindMO(message.MSG, IMIwidget.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false);
                                    }
                                    if (message.CHATTYPE == "ILOG") {
                                        // if (message.CONTENTTYPE != "" && message.PATH != "") {
                                        IMIwidget.bindIlogMsg(message.MSG, IMIwidget.getUserTimezoneDateTime(message.DATE_CREATE), false);
                                        // IMIwidget.bindMO("attachment|||" + message.CONTENTTYPE + "|||" + message.PATH, IMIwidget.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false);
                                        // }
                                        //IMIwidget.bindMO(message.MSG, IMIwidget.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false);
                                    }
                                }
                            } catch (e) { }
                        });
                    }
                },
                error: function (data) {
                    console.log(data);
                    //alert(data);
                    return data;
                }

            });
        } catch (e) { }
    };

    var sendtranscript = function () {
        try {
            var profileAPI = ProfileUrl + "profile/ChatTranscript?teamappid=" + IMIwidget.appId() + "&email=" + IMIwidget.getUserId() + "&transcriptemail=" + IMIwidget.getUserId() + "&threadid=" + IMIwidget.getThreadid() + "&aliasfilter=" + localStorage.getItem("browserfingerprint") + "&chattranscript=?";
            $.ajax({
                url: profileAPI,
                type: "POST",
                data: {},
                dataType: "jsonp",
                contentType: "text/plain",
                success: function (data) {
                    console.log("success:" + data);
                    //return data;
                },
                error: function (jqXHR, textStatus) {
                    try {
                        console.log(jqXHR);
                        //alert(data);
                    } catch (e) { }
                }
            });
        } catch (e) { }
    };
    return {
        init: function () {
            
            //alert(IMIwidget.getBrowserName());

            var browserName = IMIwidget.getBrowserName();

            if (browserName != "chrome" && browserName != "firefox" &&
                browserName != "safari" && browserName != "edge" &&
                browserName != "ie" && browserName != "opera") {
                //alert(IMIwidget.detectIE());
                //alert(IMIwidget.detectIOS());
                if (IMIwidget.detectIE() == "notsupported" || IMIwidget.detectIOS() == "notsupported") {
                    $("body").html("<i class='fa fa-info-circle'></i><p class ='anothererror'>This browser is not supported. Kindly use Chrome/Firefox</p>");
                }
            }
            IMIwidget.clearSession();
            sessionStorage.setItem("data-bind", IMIwidget.getQueryString(location.href, "id"));
            sessionStorage.setItem("data-org", IMIwidget.getQueryString(location.href, "org"));
            IMIwidget.initScript();
            $("#icworg").html("<br>with " + IMIwidget.orgName());
            $("#divicwmaincontainer").show();
            GetWidgetStyle();

            $("#icworganization").html(decodeURIComponent(IMIwidget.getQueryString(location.href, "org")));
            $("#icwagenthdr").html(IMIwidget.getQueryString(location.href, "org"));

            /* $(document).on('click', '.state1', function () {
             $('.chatwindow1').fadeToggle(200, 'linear');
             $('.open-btn').toggleClass('close-btn');
         });
 
         $(document).on('click', '.state2', function () {
             $('.chatwindow2').fadeToggle(200, 'linear');
             $('.open-btn').toggleClass('close-btn');
         });*/
            /* for auto  login start */
            if (IMIwidget.checkCookie(IMIwidget.clientId() + "_username") && IMIwidget.checkCookie(IMIwidget.clientId() + "_email")) {
                $("#icwname").val(IMIwidget.getCookie(IMIwidget.clientId() + "_username"));
                $("#icwemail").val(IMIwidget.getCookie(IMIwidget.clientId() + "_email"));
                $("#icwmobile").val(IMIwidget.getCookie(IMIwidget.clientId() + "_mobno"));
                window.parent.postMessage({
                    height: 2
                }, "*");
                IMIwidget.registeruser();
            } else {
                $('.chatwindow1').show(); //CHAT-1182
                $('.chatwindow2').hide();
            }
            /* for auto  login end */
            $("#icwmsg").keyup(function (e) {
                IMIwidget.wcindicator(e, this);
            });
            $('#icwmsg').donetyping(function () {
                IMIwidget.wcindicatorclear();
            }, 10000);

            /*for identifying unique chats*/
            try {
                if (localStorage.getItem("browserfingerprint") == null || localStorage.getItem("browserfingerprint") == undefined || localStorage.getItem("browserfingerprint") == "") {
                    localStorage.setItem("browserfingerprint", IMIwidget.getUniqueID());
                }
            } catch (e) {
                console.log("##error::" + e.message);
            }
            GetChats();
            $("#opttranscript").click(function () {
                sendtranscript();
                /*
                $("#divmodalbody").find('p').remove();
                $("#divtscriptbody").show();
                $("#divtscriptfooter").show();
                $(".error").html("");
                if (sessionStorage.getItem("tscriptemail") != null || sessionStorage.getItem("tscriptemail") != undefined) {
                    $("#icemailtranscript").val(sessionStorage.getItem("tscriptemail"));
                } else {
                    $("#icemailtranscript").val(IMIwidget.getUserId());
                }
                */
            });
        },
        initScript: function () {
            $(".icw-wms-val-alphanumericwithspace").each(function () {
                $(this).keyup(function (e) {
                    if (this.value.match(/[^0-9a-zA-Z ]/g)) {
                        this.value = this.value.replace(/[^0-9a-zA-Z ]/g, '');
                    }
                });
                $(this).blur(function (e) {
                    if (this.value.match(/[^0-9a-zA-Z ]/g)) {
                        this.value = this.value.replace(/[^0-9a-zA-Z ]/g, '');
                    }
                });
            });
            $(".icw-wms-val-numeric").each(function () {
                $(this).keyup(function (e) {
                    if (this.value.match(/[^0-9]/g)) {
                        this.value = this.value.replace(/[^0-9]/g, '');
                    }
                });
                $(this).blur(function (e) {
                    if (this.value.match(/[^0-9]/g)) {
                        this.value = this.value.replace(/[^0-9]/g, '');
                    }
                });
            });

            $("#icwemail").keyup(function (e) {
                if (this.value.match(/[<>]/g)) {
                    this.value = this.value.replace(/[<>]/g, '');
                }
            });
            $("#icwemail").blur(function (e) {
                if (this.value.match(/[<>]/g)) {
                    this.value = this.value.replace(/[<>]/g, '');
                }
            });

        },
        getSession: function (k) {
            try {
                return sessionStorage.getItem(k);
            } catch (e) {
                return "";
            }
        },
        setSession: function (k, v) {
            try {
                sessionStorage.setItem(k, v);
            } catch (e) { }
        },
        removSession: function (k) {
            try {
                sessionStorage.removeItem(k, v);
            } catch (e) { }
        },
        appId: function () {
            try {
                return sessionStorage.getItem("appid");
            } catch (e) {
                return "";
            }
        },
        appkey: function () {
            try {
                return sessionStorage.getItem("appkey");
            } catch (e) {
                return "";
            }
        },
        clientId: function () {
            try {
                return sessionStorage.getItem("data-bind");
            } catch (e) { }
        },
        orgName: function () {
            try {
                return sessionStorage.getItem("data-org");
            } catch (e) { }
        },
        getUserId: function () {
            return sessionStorage.getItem(IMIwidget.clientId() + "_email");
        },
        send: function () {
            try {
                if ($(".wdt-emoji-picker").hasClass("wdt-emoji-picker-open")) {
                    $(".wdt-emoji-picker").removeClass("wdt-emoji-picker-open");
                    $(".wdt-emoji-popup").removeClass("open");
                    $(".icon-happy").removeClass("active");

                }
            } catch (y) { }
            localStorage.setItem("tsemail", IMIwidget.getUserId());
            SendMessage();
        },
        getUserCtime: function () {
            var m_names = new Array("Jan", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul", "Aug", "Sep",
                "Oct", "Nov", "Dec");

            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth();
            var curr_year = d.getFullYear();
            var hours = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
            var am_pm = d.getHours() >= 12 ? "PM" : "AM";
            hours = hours < 10 ? "0" + hours : hours;
            var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
            var seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
            time = hours + ":" + minutes + " " + am_pm;
            return curr_date + " " + m_names[curr_month] + " " + time;

        },
        getUserTimezoneDateTime: function (srvDateTime) {
            var m_names = new Array("Jan", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul", "Aug", "Sep",
                "Oct", "Nov", "Dec");

            var d = new Date(srvDateTime);
            var curr_date = d.getDate();
            var curr_month = d.getMonth();
            var curr_year = d.getFullYear();
            var hours = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
            var am_pm = d.getHours() >= 12 ? "PM" : "AM";
            hours = hours < 10 ? "0" + hours : hours;
            var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
            var seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
            time = hours + ":" + minutes + " " + am_pm;
            return curr_date + " " + m_names[curr_month] + " " + time;
        },
        replaceurlintext: function (text) {
            var exp = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            var temp = text.replace(exp, "<a href=\"$1\" target=\"_blank\">$1</a>");
            var result = "";

            while (temp.length > 0) {
                var pos = temp.indexOf("href=\"");
                if (pos == -1) {
                    result += temp;
                    break;
                }
                result += temp.substring(0, pos + 6);

                temp = temp.substring(pos + 6, temp.length);
                if ((temp.indexOf("://") > 8) || (temp.indexOf("://") == -1)) {
                    result += "http://";
                }
            }
            return result;
        },
        bindMO: function (msg, dt, transid, isPrepend) {
            $(".divtypingindicator").remove();
            if (msg != "" && msg != undefined && msg != null && msg != "null") {
                if (msg == "$$$$$TYPING$$$$$") {
                    return;
                }
                var emojisingle = " ";
                if (msg.indexOf("attachment|||") == 0) {
                    var fileData = msg.split("|||");
                    IMIwidget.bindFile(fileData[1], fileData[2], "MO", dt, transid, isPrepend);
                } else {
                    msg = Encoder.htmlEncode(msg);
                    if (msg.split(':').length > 1) {
                        try {
                            var last = msg.lastIndexOf(":");
                            var tempmsg = msg.substr(msg.indexOf(":") + 1, msg.lastIndexOf(":"));
                           
                            if ((tempmsg.indexOf(":") + 1) == last) {
                                if (msg.lastIndexOf(":") + 1 == tempmsg.indexOf(":") + 1)
                                    emojisingle = "emojisingle";
                            }
                        } catch (x) { }
                    }
                    msg = IMIwidget.replaceurlintext(msg);
                    try {
                        msg = wdtEmojiBundle.render(msg);
                    } catch (e) { }

                    // if ($("#dicw_" + transid).length == 0) {
                    if ($("#dicw_" + transid).length == 0) {
                        var moTmpl = "<div class=\"chat_message_wrapper chat_message_left\" data-trans=\"" + transid + "\" id=\"dicw_" + transid + "\"><ul class=\"chat_message " + emojisingle + "\"><li class=\"moindicatoricon\"><span class=\"icon-headset\"></span></li><li class=\"mocolor\"><p>" + msg + "</p></li><span class=\"chat_message_time\"><span class=\"text\">Received</span>" + dt + "</span></ul></div>";
                        if (isPrepend)
                            $("#icwdivcarea").prepend(moTmpl);
                        else
                            $("#icwdivcarea").append(moTmpl);
                        // $("#icwdivcarea").prepend(moTmpl);
                        $('#chat').scrollTop($('#chat')[0].scrollHeight);
                    }
                }
            }
        },
        bindTypingMO: function (msg, isPrepend) {
            try {

                if (msg != "" && msg != undefined && msg != null && msg != null && msg.length > 0) {
                    if (msg == "$$$$$TYPING$$$$$") {
                        return;
                    }

                    if (msg == "typing_on") {
                        var moTmpl = "<div class=\"chat_message_wrapper divtypingindicator\"><ul class=\"chat_message\"><li class=\"moindicatoricon\"><span class=\"icon-headset\"></span></li><li><p><img src=\'" + domainName + "images/wcindicator.gif'\"></img></p></li></ul></div>";
                        $(".divtypingindicator").remove();
                        if (isPrepend)
                            $("#icwdivcarea").prepend(moTmpl);
                        else
                            $("#icwdivcarea").append(moTmpl);
                    } else if (msg == "typing_off") {
                        $(".divtypingindicator").remove();
                    }
                    $('#chat').scrollTop($('#chat')[0].scrollHeight);
                }
            } catch (ex) { }
        },
        bindMT: function (msg, dt, transid, isPrepend) {
            if (msg != "" && msg != undefined && msg != null && msg != "null") {
                var oldMsg = msg;
                $(".divtypingindicator").remove();
                if (msg.indexOf("attachment|||") == 0) {
                    var fileData = msg.split("|||");
                    IMIwidget.bindFile(fileData[1], fileData[2], "MT", dt, transid, isPrepend);
                    $('#chat').scrollTop($('#chat')[0].scrollHeight);
                } else {
                    msg = Encoder.htmlEncode(msg);
                    var temp = msg;
                    var count = 0;
                    var emojisingle = " ";
                    if (msg.split(':').length > 1 || msg.split('<').length > 1 || msg.split(')').length > 1 || msg.split(';').length > 1) {
                        try {
                            var icons = {
                                "<3": "heart",
                                ":o)": "monkey_face",
                                ":*": "kiss",
                                ":-*": "kiss",
                                "</3": "broken_heart",
                                "=)": "smiley",
                                "=-)": "smiley",
                                "C:": "smile",
                                "c:": "smile",
                                ":D": "smile",
                                ":-D": "smile",
                                ":>": "laughing",
                                ":->": "laughing",
                                ";)": "wink",
                                ";-)": "wink",
                                "8)": "sunglasses",
                                ":|": "neutral_face",
                                ":-|": "neutral_face",
                                ":\\": "confused",
                                ":-\\": "confused",
                                ":/": "confused",
                                ":-/": "confused",
                                ":p": "stuck_out_tongue",
                                ":-p": "stuck_out_tongue",
                                ":P": "stuck_out_tongue",
                                ":-P": "stuck_out_tongue",
                                ":b": "stuck_out_tongue",
                                ":-b": "stuck_out_tongue",
                                ";p": "stuck_out_tongue_winking_eye",
                                ";-p": "stuck_out_tongue_winking_eye",
                                ";b": "stuck_out_tongue_winking_eye",
                                ";-b": "stuck_out_tongue_winking_eye",
                                ";P": "stuck_out_tongue_winking_eye",
                                ";-P": "stuck_out_tongue_winking_eye",
                                "):": "disappointed",
                                ":(": "disappointed",
                                ":-(": "disappointed",
                                ">:(": "angry",
                                ">:-(": "angry",
                                ":'(": "cry",
                                "D:": "anguished",
                                ":o": "open_mouth",
                                ":-o": "open_mouth",
                                ":O": "open_mouth",
                                ":-O": "open_mouth",
                                ":)": "slightly_smiling_face",
                                "(:": "slightly_smiling_face",
                                ":-)": "slightly_smiling_face"
                            };

                            msg.replace(/[:;83B>^)*@$&I\]|\-_(=o)pPxXDyOCcb:)]+/g, function (match) {
                                typeof icons[match] != 'undefined' ? count = IMIwidget.getCount(match, msg, count) : null;
                            });
                            if (count == 1)
                                emojisingle = "emojisingle";
                        } catch (y) { }

                    }
                    if (count == 0 || count == undefined) {
                        try {
                            var last = msg.lastIndexOf(":");
                            var tempmsg = msg.substr(msg.indexOf(":") + 1, msg.lastIndexOf(":"));
                            if ((tempmsg.indexOf(":") + 1) == last) {
                                if (msg.lastIndexOf(":") + 1 == temp.length)
                                    emojisingle = "emojisingle";
                            }
                        } catch (x) { }
                    }

                    msg = IMIwidget.replaceurlintext(msg);
                    if ($('#hdnisemojienable').val() == 1) {
                        try {
                            msg = wdtEmojiBundle.render(msg);
                        } catch (e) { }
                    } else {
                        emojisingle = "";
                    }

                    if (count == 0 || count == undefined) {
                        if (oldMsg == Encoder.htmlDecode(msg)) {
                            emojisingle = "";
                        }
                    }

                    // if ($("#dicw_" + transid).length == 0) {
                    if ($("#dicw_" + transid).length == 0) {
                        var mtTmpl = "<div class=\"chat_message_wrapper chat_message_right\" id=\"dicw_" + transid + "\"  data-trans=\"" + transid + "\"  ><ul class=\"chat_message " + emojisingle + "\"><li class=\"mtcolor\"><p>" + msg + "</p></li><span class=\"chat_message_time\"><span class=\"text\">Sent</span>" + dt + "</span></ul></div>";
                        if (isPrepend)
                            $("#icwdivcarea").prepend(mtTmpl);
                        else
                            $("#icwdivcarea").append(mtTmpl);

                        //$('.chat_message_right').fadeIn("slow", function () {
                        //$(".chat_message p").slideDown("200", "swing")
                        //});

                        $('#chat').scrollTop($('#chat')[0].scrollHeight);
                        $('.mtcolor').css('background', mtcolor);
                        if (mtcolor != '')
                            $('.mtcolor').css('color', '#fff');
                        if (localStorage.getItem("tsemail") == IMIwidget.getUserId()) {
                            $("#opttranscript").css("display", "block");
                        }
                    }
                }
                //disable the click of your clickable area
                $(".dz-hidden-input").prop("disabled", true);
            }
        },
        getCount: function (match, msg, count) {
            if (match == msg) {
                return  count + 1;
            }
        },
        bindFile: function (contentType, url, msgType, dt, transid, isPrepend) {
            try {
                if (url != "") {
                    var uploadMsg ="";
                    if (msgType == "MO") {
                        var moTmpl="";
                        var cntType = url.substr(url.lastIndexOf(".") + 1);
                        if (cntType == "jpg" || cntType == "gif" || cntType == "png") {
                            contentType = "image";
                        } else {
                            contentType = "file";
                        }
                        try {
                             url = url.replace(/\\/g, "/");
                             uploadMsg = url.substr(url.lastIndexOf("/") + 1, url.length);
                        } catch (x) { }

                        //if ($("#dicw_" + transid + "_" + uploadMsg).length == 0) {
                        if (document.getElementById("dicw_" + transid + "_" + uploadMsg) == null) {
                            if (contentType == "image") {
                                 moTmpl = "<div class=\"chat_message_wrapper chat_message_left\" id=\"dicw_" + transid + "_" + uploadMsg + "\"  data-trans=\"" + transid + "\"><ul class=\"chat_message attachimage\"><li class=\"moindicatoricon\"><span class=\"icon-headset\"></span></li><li><a onclick=\"IMIwidget.checkFileExist('" + url + "')\" class=\"image-a\"> <img src=\"" + url + "\" onerror=\"this.src='" + domainName + "images/noimagefound.png'\"><span class=\"icon-dwnimg\"></span></a>" + "</li><span class=\"chat_message_time\"><span class=\"text\">Received</span>" + dt + "</span></ul></div>";
                            } else {
                                 moTmpl = "<div class=\"chat_message_wrapper chat_message_left\"  id=\"dicw_" + transid + "_" + uploadMsg + "\" data-trans=\"" + transid + "\"><ul class=\"chat_message\"><li class=\"moindicatoricon\"><span class=\"icon-headset\"></span></li><li><a onclick=\"IMIwidget.checkFileExist('" + url + "')\" class=\"image-file\"> <i class=\"icon-attachment\"></i><span class=\"file-name\">" + uploadMsg + "</span></a></li>" + "<span class=\"chat_message_time\"><span class=\"text\">Received</span>" + dt + "</span></ul></div>";
                            }
                            if (isPrepend)
                                $("#icwdivcarea").prepend(moTmpl);
                            else
                                $("#icwdivcarea").append(moTmpl);
                            $('#chat').scrollTop($('#chat')[0].scrollHeight);
                        }
                    }
                    if (msgType == "MT") {
                        var mtTmpl ="";
                        try {
                            uploadMsg = url.substr(url.lastIndexOf("/") + 1, url.length);
                            uploadMsg = uploadMsg.substr(uploadMsg.indexOf("_") + 1, uploadMsg.length);
                        } catch (x) { }

                        //  if ($("#dicw_" + transid + "_" + uploadMsg).length == 0) {
                        if (document.getElementById("dicw_" + transid + "_" + uploadMsg) == null) {
                            if (contentType == "image") {
                                 mtTmpl = "<div class=\"chat_message_wrapper chat_message_right\"  id=\"dicw_" + transid + "_" + uploadMsg + "\" data-trans=\"" + transid + "\"><ul class=\"chat_message attachimage\"><li><a onclick=\"IMIwidget.checkFileExist('" + url + "')\" class=\"image-a\"> <img src=\"" + url + "\"  onerror=\"this.src='" + domainName + "images/noimagefound.png'\"><span class=\"icon-dwnimg\"></span></a></li>" + "<span class=\"chat_message_time\"><span class=\"text\">Sent</span>" + dt + "</span></ul></div>";
                            } else {
                                 mtTmpl = "<div class=\"chat_message_wrapper chat_message_right\" id=\"dicw_" + transid + "_" + uploadMsg + "\"  data-trans=\"" + transid + "\"><ul class=\"chat_message\"><li><a onclick=\"IMIwidget.checkFileExist('" + url + "')\" class=\"image-file\"> <i class=\"icon-attachment\"></i><span class=\"file-name\">" + uploadMsg + "</span></a></li>" + "<span class=\"chat_message_time\"><span class=\"text\">Sent</span>" + dt + "</span></ul></div>";
                            }
                            //$("#icwdivcarea").append(mtTmpl);
                            if (isPrepend)
                                $("#icwdivcarea").prepend(mtTmpl);
                            else
                                $("#icwdivcarea").append(mtTmpl);
                            $('#chat').scrollTop($('#chat')[0].scrollHeight);
                        }
                    }
                }
            } catch (e) { }
        },
        checkFileExist: function (filelink) {
            $.ajax({
                type: "POST",
                url: domainName + "Handlers/ICWUpload.ashx?action=checkattachment",
                data: "filelink=" + filelink,
                async: false,
                success: function (msg) {
                    if (msg == "1")
                        window.open(filelink);
                    else
                        window.open(domainName + "404.htm");
                },
                error: function (xhr, err, thrownError) {
                    console.log("error in checking file existence:" + err);
                }
            });
        },
        bindMsg: function (msg, type, teamname, isPrepend) {
            var mtTmpl = "<span class=\"servicemsg\"> You are now chatting with <span class=\"serviceuser\">" + msg + "</span> from " + teamname + " </span>";
            // IMIwidget.getSession("teamname") + " --</span>";
            if (isPrepend)
                $("#icwdivcarea").prepend(mtTmpl);
            else
                $("#icwdivcarea").append(mtTmpl);
            //  $("#icwdivcarea").append(mtTmpl);
            $('#chat').scrollTop($('#chat')[0].scrollHeight);
            $("#typicallyrply").css("display", "none");
            $('#icwagenthdr').removeClass('goup');
        },
        bindIlogMsg: function (msg, type, isPrepend) {

            var logMsg = msg.split('|');
            var mtTmpl = "<span class=\"servicemsg\"> " + logMsg[1] + " </span>";
            // IMIwidget.getSession("teamname") + " --</span>";
            if (isPrepend)
                $("#icwdivcarea").prepend(mtTmpl);
            else
                $("#icwdivcarea").append(mtTmpl);
            //  $("#icwdivcarea").append(mtTmpl);
            $('#chat').scrollTop($('#chat')[0].scrollHeight);
        },
        bindCloseMsg: function (msg, type, isPrepend) {
            return; /*for CHAT-1191*/
            /*var mtTmpl = "<span class=\"servicemsg\"> Chat has been closed </span>";
            //// $("#icwdivcarea").append(mtTmpl);
            //if (isPrepend)
            //    $("#icwdivcarea").prepend(mtTmpl);
            //else
            //    $("#icwdivcarea").append(mtTmpl);
            //$('#chat').scrollTop($('#chat')[0].scrollHeight);*/
        },
        showToolTip: function (i, m, p) {
            try {
                if (p == "" || p == undefined) {
                    p = "right";
                }
                $(i)
                    .attr("data-toggle", "tooltip")
                    .attr("data-original-title", m)
                    .attr("data-placement", p)
                    .tooltip({
                        trigger: 'manual'
                    })
                    .tooltip("show");
                if (!$(i).hasClass('error-txtbox')) {
                    $(i).addClass('error-txtbox');
                }

                $(i).focusin(function () {
                    $(this).tooltip('destroy');
                    $(this).removeClass('error-txtbox');
                });
            } catch (e) { }

        },
        destroyToolTip: function (i) {
            try {
                $(i).tooltip('destroy');
                $(i).removeClass('error-txtbox');
            } catch (e) { }
        },
        validateEmail: function (email) {
            var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return (regex.test(email)) ? true : false;
        },
        validateMobile: function (mob) {
            try {
                var pattern = /^\d{10,15}$/;
                if (!mob.match(pattern)) {
                    return false;
                }
                return true;
            } catch (e) {
                return false;
            }
        },
        storeLocal: function (data) {
            var lkey = IMIwidget.getLskey();
            return localStorage.setItem(lkey, JSON.stringify(data));
        },
        getLocal: function () {
            var lkey = IMIwidget.getLskey();
            return localStorage.getItem(lkey);
        },
        localstoragesize: function () {

            var allStrings = '';
            for (var key in window.localStorage) {
                if (window.localStorage.hasOwnProperty(key)) {
                    allStrings += window.localStorage[key];
                }
            }
            return allStrings ? 3 + ((allStrings.length * 16) / (8 * 1024)) : 0;

        },
        addLocal: function (msg, dt, transid, type) {
            /*  try {
            msg = msg.replace(/(\r\n|\n|\r)/gm, ' ');
            } catch (e) { }
            var data = IMIwidget.getLocal();
            if (IMIwidget.localstoragesize() >= 4900) //5mb{
            if (data == undefined || data == "") {
            //new user can't decide which user to remove
            console.write("unable to save to localstorage");
            } else {
            //remove old data of that user
            data = " {\"items\": [] }";
            var addData = "{\"msg\":\"" + msg + "\",\"dt\":\"" + dt + "\",\"type\":\"" + type + "\",\"transid\":\"" + transid + "\",\"time\":\"" + new Date() + "\"}";
            data.items.push(addData);
            //  IMIwidget.storeLocal(data);
            }

            } else {
            if (data == undefined || data == "") {
            data = " {\"items\": [] }";
            }
            data = $.parseJSON(data);
            var addData = "{\"msg\":\"" + msg + "\",\"dt\":\"" + dt + "\",\"type\":\"" + type + "\",\"transid\":\"" + transid + "\"}";
            data.items.push(addData);
            //IMIwidget.storeLocal(data);

            }
             */

        },
        bindPrevData: function () {
            /*
            $("#icwdivcarea").html("");
            var pdata = IMIwidget.getLocal();
            if (pdata != undefined && pdata != null && pdata != "") {
            try {
            data1 = data1.replace(/(\r\n|\n|\r)/gm, '\\n');
            } catch (e1) { }
            var jData = $.parseJSON(pdata);
            if (jData != null && jData.items != null) {
            $.each(jData.items, function (key) {
            try {
            var item = $.parseJSON(jData.items[key]);

            if (item.type == "MT") {
            IMIwidget.bindMT(item.msg, item.dt, item.transid, false);

            }
            if (item.type == "MO") {
            IMIwidget.bindMO(item.msg, item.dt, item.transid, false);
            }
            } catch (e) { }
            });
            setTimeout(function () {
            $('#chat').scrollTop($('#chat')[0].scrollHeight);
            }, 100);
            // $('#chat').scrollTop($('#chat')[0].scrollHeight);
            console.log($('#chat')[0].scrollHeight);
            }
            }
             */
        },
        getLskey: function () {
            var appid = IMIwidget.appId();
            var user = IMIwidget.getSession(appid + "_email");
            return appid + "_" + user;
        },
        registerRTM: function () {
            RegisterRTM();
        },
        close: function () {
            CloseChat();
        },
        confirm: function () {
            Confirm();
        },
        clearSession: function () {
            try {
                try {
                    sessionStorage.clear();
                    sessionStorage.setItem("data-bind", IMIwidget.getQueryString(location.href, "id"));
                    sessionStorage.setItem("data-org", IMIwidget.getQueryString(location.href, "org"));
                } catch (e1) { }
                try {
                    IMI.IMIconnect.shutdown();
                } catch (e2) { }
                var arr = [];
                for (var i = 0; i < localStorage.length; i++) {
                    if (localStorage.key(i).substring(0, 9) == 'IMI.Core.') {
                        arr.push(localStorage.key(i));
                    }
                }

                for (var x = 0; x < arr.length; x++) {
                    localStorage.removeItem(arr[x]);
                }
                var userId = localStorage.getItem("browserfingerprint").toLowerCase();
                localStorage.removeItem(userId + "_" + IMIwidget.clientId() + "_threadid");
                window.parent.setappsession();
            } catch (e) { }

        },
        startErrMsg: function (msg) {
            $("#icweStart").text(msg);
            // $("#newconv").text("Start chat");
            //  var startbuttontext = IMIwidget.getSession("buttontext");
            $("#newconv").text($('#newconv').attr('data-text'));
        },
        getBrowserName1: function () {
            try {
                var ua = navigator.userAgent;

                var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
                // Firefox 1.0+
                var isFirefox = typeof InstallTrigger !== 'undefined';
                // At least Safari 3+: "[object HTMLElementConstructor]"
                var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
                // Internet Explorer 6-11
                var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                // Edge 20+
                var isEdge = !isIE && !!window.StyleMedia;
                // Chrome 1+
                var isChrome = !!window.chrome && !!window.chrome.webstore;
                // Blink engine detection
                var isBlink = (isChrome || isOpera) && !!window.CSS;

                var isChromeMobile = false;
                //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                if (/Android/i.test(navigator.userAgent))
                    isChromeMobile = true;

                var isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);


                if (isOpera) {
                    return "opera";
                } else if (isFirefox) {
                    return "firefox";
                } else if (isSafari) {
                    return "safari";
                } else if (isIE) {
                    return "ie";
                } else if (isEdge) {
                    return "edge";
                } else if (isChrome) {
                    return "chrome";
                } else if (isBlink) {
                    return "blink";
                } else if (isChromeMobile) {
                    return "chrome";
                } else if (isIOS) {
                    return "safari";
                }

                return "Invalid Browser";
            } catch (ex) {
                // IMI.log(ex);
                return "Invalid Browser";
            }

        },
        getBrowserName: function () {
            try {
                var nVer = navigator.appVersion;
                var nAgt = navigator.userAgent;
                var browserName = navigator.appName;
                var fullVersion = '' + parseFloat(navigator.appVersion);
                var majorVersion = parseInt(navigator.appVersion, 10);
                var nameOffset, verOffset, ix;

                //alert(nAgt);
                isIE = /*@cc_on!@*/ false || !!document.documentMode;
                isEdge = !isIE && !!window.StyleMedia;

                // In Opera 15+, the true version is after "OPR/" 
                if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
                    browserName = "opera";
                    fullVersion = nAgt.substring(verOffset + 4);
                }
                // In older Opera, the true version is after "Opera" or after "Version"
                else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
                    browserName = "opera";
                    fullVersion = nAgt.substring(verOffset + 6);
                    if ((verOffset = nAgt.indexOf("Version")) != -1)
                        fullVersion = nAgt.substring(verOffset + 8);
                }
                // In MSIE, the true version is after "MSIE" in userAgent
                else if ((verOffset = nAgt.indexOf("MSIE")) != -1 || isIE) {
                    browserName = "ie";
                    fullVersion = nAgt.substring(verOffset + 5);
                }
                // In Chrome, the true version is after "Chrome" 
                else if ((verOffset = nAgt.indexOf("Chrome")) != -1 && !isEdge) {
                    browserName = "chrome";
                    fullVersion = nAgt.substring(verOffset + 7);
                }
                // In Safari, the true version is after "Safari" or after "Version" 
                else if ((verOffset = nAgt.indexOf("Safari")) != -1 && !isEdge) {
                    browserName = "safari";
                    fullVersion = nAgt.substring(verOffset + 7);
                    if ((verOffset = nAgt.indexOf("Version")) != -1)
                        fullVersion = nAgt.substring(verOffset + 8);
                }
                // In Firefox, the true version is after "Firefox" 
                else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
                    browserName = "firefox";
                    fullVersion = nAgt.substring(verOffset + 8);
                }
                // In most other browsers, "name/version" is at the end of userAgent 
                else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
                    (verOffset = nAgt.lastIndexOf('/'))) {
                    browserName = nAgt.substring(nameOffset, verOffset);
                    fullVersion = nAgt.substring(verOffset + 1);
                    if (browserName.toLowerCase() == browserName.toUpperCase()) {
                        browserName = navigator.appName;
                    }
                }
                // trim the fullVersion string at semicolon/space if present
                if ((ix = fullVersion.indexOf(";")) != -1)
                    fullVersion = fullVersion.substring(0, ix);
                if ((ix = fullVersion.indexOf(" ")) != -1)
                    fullVersion = fullVersion.substring(0, ix);

                majorVersion = parseInt('' + fullVersion, 10);
                if (isNaN(majorVersion)) {
                    fullVersion = '' + parseFloat(navigator.appVersion);
                    majorVersion = parseInt(navigator.appVersion, 10);
                }
                browserName = browserName.toLowerCase();
                //alert(browserName);
                //alert(majorVersion);
                return browserName;
            } catch (ex) {
                // IMI.log(ex);
                return "Invalid Browser";
            }

        },
        detectIE: function () {
            try {
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf('MSIE ');
                var trident = ua.indexOf('Trident/');
                var edge = ua.indexOf('Edge/');
                if (msie > 0) {
                    // IE 10 or older
                    return "notsupported";
                } else if (trident > 0) {
                    // IE 11
                    return "supported";
                } else if (edge > 0) {
                    // Edge
                    return "supported";
                } else {
                    // other browser
                    return "notsupported";
                }
            } catch (ex) {
                return "notsupported";
            }
        },
        detectIOS: function () {
            try {
                if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
                    if (!!window.indexedDB) {
                        //return 'iOS 8 and up';
                        return "supported";
                    }
                    if (!!window.SpeechSynthesisUtterance) {
                        //return 'iOS 7';
                        return "supported";
                    }
                    if (!!window.webkitAudioContext) {
                        //return 'iOS 6';
                        return "supported";
                    }
                    if (!!window.matchMedia) {
                        //return 'iOS 5';
                        return 'notsupported';
                    }
                    if (!!window.history && 'pushState' in window.history) {
                        //return 'iOS 4';
                        return 'notsupported';
                    }
                    //return 'iOS 3 or earlier';
                    return 'notsupported';
                }
                //return 'Not an iOS device';
                return 'notsupported';
            } catch (ex) {
                return "notsupported";
            }
        },
        getDomain: function () {
            try {
                var a = document.createElement('a');
                a.href = window.document.referrer;
                return a.hostname;
            } catch (e) {
                return window.document.location.hostname;
            }

        },
        showFileUpload: function () {
            $(".dz-hidden-input").prop("disabled", false);
            $('#chat').click();

        },
        setshowprevhist: function (flag) {
            showprevhistory = flag;
        },
        getshowprevhist: function () {
            return showprevhistory;
        },
        getTopic: function () {
            return topic;
        },
        getThreadName: function () {
            return topic;
        },
        getThreadid: function () {
            return threadid;
        },
        loadPlugins: function () {
            //DropZone starts
            if ($("#chat").hasClass("dz-clickable"))
                return;
            Dropzone.autoDiscover = false;
            $("#chat").dropzone({
                maxFilesize: 10,
                url: domainName + "Handlers/ICWUpload.ashx?action=senduploadfile",
                dictResponseError: 'Error uploading file!',
                acceptedFiles: ".jpg,.gif,.png,.mp4,.mp3,.pdf,.docx,.doc,.xls,.xlsx,.csv,.ppt,.pptx,.wav",
                dictFileTooBig: 'File is bigger than 10MB.',
                uploadMultiple: false,
                withCredentials: false,
                maxFiles: 1,
                previewsContainer: '#icwdivcarea',
                thumbnailWidth: null,
                thumbnailHeight: null,
                init: function () { },
                success: function (file, response) {
                    var outval = response.split('|');
                    try {
                        SendFile(outval[0], outval[1]);
                    } catch (x) { }
                    this.removeFile(file);
                },
                error: function (file, response) {
                    $("#icweMsg").text(response);
                    this.removeFile(file);
                }
            });
            $(".dz-hidden-input").prop("disabled", true);
            //DropZone END

            //Emojis start
            if ($('#hdnisemojienable').val() == 1) {
                $(".wdt-emoji-popup").css("display", "block");
                wdtEmojiBundle.defaults.type = 'emojione';
                wdtEmojiBundle.defaults.emojiSheets.emojione = emojiImageURL;
                $("#icwmsg").addClass("wdt-emoji-bundle-enabled");
                wdtEmojiBundle.init('.wdt-emoji-bundle-enabled');
                $(".icon-happy").blur(function () {
                    // alert(1);
                });
                //emojis end
            }
        },
        sendFire: function (evt) {
            var ev = ((window.event) ? (window.event) : (evt));
            var ahref = document.getElementById('aSend');
            var charCode = ((window.event) ? (window.event.keyCode) : (((evt.which) ? (evt.which) : (evt.keyKode))));
            if (charCode == 13) {
                ahref.click();
            }
        },
        getQueryString: function (url, qname) {
            try {
                if (!url) {
                    url = window.location.href;
                }
                var results = new RegExp('[\\?&]' + qname + '=([^&#]*)').exec(url);
                if (!results) {
                    return "";
                }
                return results[1] || "";
            } catch (e) { }
        },
        registeruser: function () {
            RegisterUser();
        },
        setCookie: function (cname, cvalue) {
            document.cookie = cname + "=" + cvalue + ";expires=;path=/";
        },
        getCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";

        },
        checkCookie: function (cname) {
            var user = IMIwidget.getCookie(cname);
            if (user != "") {
                return true;
            } else {
                return false;
            }
        },
        deleteCookie: function (cname) {
            // $.cookie(cname, null, { path: '/' });
            document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
        },
        wcindicator: function (e, ctrl) {
            wcindicator(e, ctrl);
        },
        wcindicatorclear: function () {
            wcindicatorclear();
        },
        sendtranscript: function () {
            sendtranscript();
        },
        GetWCPreviousHistory: function () {

            GetWCPreviousHistory();
        },
        getUniqueID: function () {
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now(); //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;

        },
    };
}
    (jQuery);

IMIwidget.init();

function jsonPcallback(msg) {

    try {
        if (msg != '' && msg != undefined) {
            var jData = msg;
            if (jData != null) {
                if (jData.statusCode == "2400") {
                    var appData = jData.response.data;
                    if (appData == null || appData == undefined)
                        appData = jData.response;
                    var appid = appData.appid;
                    if (appid != "" && appid != undefined) {
                        IMIwidget.setSession("appid", appid);
                        IMIwidget.setSession("appkey", appData.clientkey);
                        IMIwidget.setSession("teamname", appData.teamname);
                        $("#icworganization").html(appData.oraganization);
                        IMIwidget.registerRTM();
                        //alert($('.wdt-emoji-picker').length);

                        if (localStorage.getItem("tsemail") != IMIwidget.getUserId()) {
                            $('#opttranscript').css("display", "none");
                        }
                    } else {
                        IMIwidget.startErrMsg("unable to register");
                        $("#newconv").attr('disabled', false);
                        $('#newconv').attr('onClick', 'IMIwidget.registeruser()');
                    }
                } else if (jData.statusCode == "2401") {
                    IMIwidget.startErrMsg("You are not authorized to use this service.");
                    $("#newconv").attr('disabled', false);
                    $('#newconv').attr('onClick', 'IMIwidget.registeruser()');
                } else {
                    IMIwidget.startErrMsg("unable to register");
                    $("#newconv").attr('disabled', false);
                    $('#newconv').attr('onClick', 'IMIwidget.registeruser()');
                }

            } else {
                IMIwidget.startErrMsg("unable to register");
                $("#newconv").attr('disabled', false);
                $('#newconv').attr('onClick', 'IMIwidget.registeruser()');
            }

        } else {
            IMIwidget.startErrMsg("unable to register");
            $("#newconv").attr('disabled', false);
            $('#newconv').attr('onClick', 'IMIwidget.registeruser()');
        }
    } catch (e1) {
        IMIwidget.startErrMsg("unable to connect");
        $("#newconv").attr('disabled', false);
        $('#newconv').attr('onClick', 'IMIwidget.registeruser()');
    }

}


function chattranscript(msg) {

    try {

        if (msg != '' && msg != undefined) {
            $("#divtscriptfooter").css("display", "none");
            $("#divmodalbody").html('');
            if (msg == "1") {
                $("#divmodalbody").append("<p>Chat transcript will be sent to " + IMIwidget.getUserId() + " once the chat is closed by the agent</p>");
                $("#emailtranscript").modal();
            } else if (msg == "2") {
                //$("#divmodalbody").append("<p></p>");
                //$("#emailtranscript").hide();
                $("#divmodalbody").append("<p>New Chat: Transcripts can be requested on chats that hold atleast one message.</p>");
                $("#emailtranscript").modal();
            } else if (msg == "3") {

                $("#divmodalbody").append("<p>RTF: Email Transcript cannot be sent if Right to be Forgotten has been invoked. Please contact your agent for further assistance.</p>");
                $("#emailtranscript").modal();
            }
            sessionStorage.setItem("tscriptemail", msg);
        } else {

        }
    } catch (e1) {

    }

}


function validateDomain(msg) {
    try {

        console.log("validateDomain response:" + msg);
        if (msg != '' && msg != undefined) {
            var jData = msg;
            if (jData != null) {
                if (jData.statusCode == "200") {
                    validDomain = "true";
                    sessionStorage.setItem("tempsendmsg", $("#icwmsg").val().trim());
                    $("#icwmsg").val("");
                    var txtmsg = sessionStorage.getItem("tempsendmsg");
                    if (txtmsg != '') {
                        var messaging = IMI.ICMessaging.getInstance();
                        console.log(messaging);
                        var message = new IMI.ICMessage();

                        message.setMessage(txtmsg);
                        // message.setTopic(IMIwidget.getTopic());

                        var thread = new IMI.ICThread();
                        thread.setId(IMIwidget.getThreadid());
                        thread.setTitle(IMIwidget.getThreadName());
                        //thread.setStreamName(IMIwidget.getTopic());
                        thread.setType(IMI.ICThreadType.Conversation);
                        message.setThread(thread);

                        try {
                            var appid = IMIwidget.clientId();
                            var a = document.createElement('a');
                            a.href = window.document.referrer;

                            var jobj = {
                                "name": IMIwidget.getSession(appid + "_name"),
                                "Webpage": window.document.referrer.match(/[^\/]+$/)[0],
                                "Website": a.hostname,
                                "mobileno": IMIwidget.getSession(appid + "_mobile"),
                                "emailid": IMIwidget.getSession(appid + "_email"),
                                "browserfingerprint": localStorage.getItem("browserfingerprint"),
                            };
                            message.setExtras(jobj);
                            console.log(message);
                        } catch (e) {
                            console.log(e.message);
                        }

                        var callback = {
                            onSuccess: function (msg) {
                                console.log("message sent");
                                $("#aSend").css('display', 'block');
                                $("#sendloading").css("display", "none");
                                $("#icwmsg").val(sessionStorage.getItem("tempsendmsg"));
                                IMIwidget.bindMT(txtmsg, IMIwidget.getUserCtime(), new Date().getTime(), false);
                                IMIwidget.addLocal(txtmsg, IMIwidget.getUserCtime(), new Date().getTime(), "MT");

                                $("#icwmsg").val("");

                            },
                            onFailure: function (errormsg) {
                                $("#icwmsg").val(sessionStorage.getItem("tempsendmsg"));
                                $("#icweMsg").html("failed to send message");
                                console.log("failed to send message");
                                console.log(errormsg);
                            }

                        };
                        console.log(messaging.isConnected());
                        console.log("message:" + txtmsg);
                        console.log(message);
                        //console.log(message);
                        messaging.publishMessage(message, callback);
                    } else {
                        $("#icweMsg").html("failed to send message");
                    }
                } else {
                    $("#icweMsg").html("failed to send message");
                }

            } else {
                $("#icweMsg").html("Invalid access");
            }
        } else {
            $("#icweMsg").html("Invalid access");
        }
    } catch (e1) {
        $("#icweMsg").html("failed to send message");
    }

}

var mtcolor = '';

function widgetStyle(msg) {
    try {
        if (msg != '' && msg != undefined) {
            try {
                if (msg[0].showprevhist == 0) {
                    IMIwidget.setshowprevhist(false);
                } else {
                    IMIwidget.setshowprevhist(true);
                }
                $('#divhead').css('background-color', msg[0].widgetcolor);
                $('#divhead1').css('background-color', msg[0].widgetcolor);
                $('#chatbgcolor').css('background-color', msg[0].widgetcolor);
                $('#aSendicon').css('color', msg[0].widgetcolor);

                mtcolor = msg[0].widgetcolor;
                // $('#chatpageheading').css('color', msg[0].widgetcolor);
                // $('.form-feild').css('border-bottom-color', msg[0].widgetcolor);
                $('#newconv').text(msg[0].buttontext);
                $('#newconv').attr('data-text', msg[0].buttontext);
                //IMIwidget.setSession("buttontext", msg[0].buttontext);
                $('#newconv').css('background-color', msg[0].button_color);

            } catch (ex) { }
            try {
                pathArray = window.location.host.split('.');
                var arrLength = pathArray.length;
                var domainName = pathArray.slice(arrLength - 2, arrLength).join('.');
                document.domain = domainName;
            } catch (e) { }
            if (msg[0].agentavail == "0" || msg[0].agentavail == undefined) {
                if (window.document.referrer == '') {
                    $("#newconv").attr("disabled", "disabled");
                    $("#newconv").addClass("btn-disabled");
                } else {
                    $("#newconv").attr("disabled", "disabled");
                    $("#newconv").attr("title", "Currently no Agents are available.");
                    $("#newconv").addClass("btn-disabled");
                }
            } else {
                if (window.document.referrer == '') {
                    $("#newconv").attr("disabled", "disabled");
                    $("#newconv").addClass("btn-disabled");
                } else {
                    $("#newconv").attr("onclick", "IMIwidget.registeruser()");
                }
            }
            if (msg[0].button_shape == "RoundedCorner") {
                // $('#newconv').css('border-radius', '70px');
                document.getElementById("start-chat").style.borderRadius = "70px";
            }
            $('#chatpageheading').text(msg[0].headertext);
            $('#headerdesc').text(msg[0].bylinetext);

            if (msg[0].outofoffice != undefined || msg[0].outofoffice != null) {
                $('#oooMsg').css('display', 'block');
                $('#oooMsg').text(msg[0].outofoffice);
                // $('#oooMsg').css('color', msg[0].widgetcolor);
            } else {
                $('#oooMsg').css('display', 'none');
            }
            if (msg[0].isemojienable == true) {
                $('#hdnisemojienable').val('1');
            } else {
                $('#hdnisemojienable').val('0');
            }

            if (msg[0].waittime == null || msg[0].waittime == undefined || msg[0].waittime == '') {
                $('#typicallyrply').css('display', 'none');
                $('#icwagenthdr').removeClass('goup');
            } else {
                $('#typicallyrply').text(msg[0].waittime);
                $('#icwagenthdr').addClass('goup');
            }

        } else {
            //$('#newconv').removeAttr('style');
            $('#newconv').css('background-color', '');
        }

    } catch (e1) {
        alert(e1.message);
    }
    ////setTimeout(Timeout, 1000); CHAT-1182
    document.getElementById("divloader").style.display = 'none';
    document.getElementById("divaside").style.display = 'block';
}

function Timeout() {
    try {
        document.getElementById("divloader").style.display = 'none';
        $("#chatwindow1").show();
    } catch (e) { }
}
var IMIchatstorage = function () {
    var dbtype = "local";
    var db;
    return {
        init: function () {

            try {
                window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

                window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
                window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

                if (!window.indexedDB) {
                    // window.alert("Your browser doesn't support a stable version of IndexedDB.")
                    dbtype = "local";
                } else {
                    dbtype = "indexeddb";
                    createDB();
                }

            } catch (e) { }
            return dbtype;
        },
        createDB: function () {
            try {

                var request = window.indexedDB.open("imichatdb");
                request.onerror = function (event) {
                    console.log("error: ");
                };

                request.onsuccess = function (event) {
                    db = request.result;
                    console.log("success: " + db);
                };

                //request.onupgradeneeded = function(event) {
                //    var db = event.target.result;
                //    var objectStore = db.createObjectStore("employee", {keyPath: "id"});

                //    for (var i in employeeData) {
                //        objectStore.add(employeeData[i]);
                //    }
                //}
            } catch (e) { }
        },
        get: function (lkey) {
            IMIchatstorage.init();
            if (dbtype == "local") {
                return localStorage.getItem(lkey);
            } else {
                var objectStore = $.indexedDB("imichat").objectStore("imichat"); //, /* Optional */ mode);
                return objectStore.get(lkey);
            }
        },
        set: function (lkey, data) {
            IMIchatstorage.init();
            if (dbtype == "local") {
                localStorage.setItem(lkey, JSON.stringify(data));
            } else {
                var objectStore = $.indexedDB("imichat").objectStore("imichat", {
                    "schema": {
                        "1": function (versionTransaction) {
                            var catalog = versionTransaction.createObjectStore("imichat", {
                                "keyPath": "itemId"
                            });
                            catalog.createIndex("price");
                        },
                        // This was added in the next version of the site
                        "2": function (versionTransaction) {
                            var cart = versionTransaction.createObjectStore("imichat", {
                                "autoIncrement": true
                            });
                            //cart.createIndex("itemId");
                            //var wishlist = versionTransaction.createObjectStore("wishlist", {
                            //    "autoIncrement": false,
                            //    "keyPath": "itemId"
                            //});
                            //wishlist.createIndex("name");
                        }
                    }
                }); //, /* Optional */ mode);
                return objectStore.add(lkey, data);
            }
        },
        remove: function (lkey) { },
        clearall: function () { }

    };
}
    (jQuery);
Encoder = {
    EncodeType: "entity",
    isEmpty: function (r) {
        return r ? null === r || 0 == r.length || /^\s+$/.test(r) : !0;
    },
    arr1: ["&nbsp;", "&iexcl;", "&cent;", "&pound;", "&curren;", "&yen;", "&brvbar;", "&sect;", "&uml;", "&copy;", "&ordf;", "&laquo;", "&not;", "&shy;", "&reg;", "&macr;", "&deg;", "&plusmn;", "&sup2;", "&sup3;", "&acute;", "&micro;", "&para;", "&middot;", "&cedil;", "&sup1;", "&ordm;", "&raquo;", "&frac14;", "&frac12;", "&frac34;", "&iquest;", "&Agrave;", "&Aacute;", "&Acirc;", "&Atilde;", "&Auml;", "&Aring;", "&AElig;", "&Ccedil;", "&Egrave;", "&Eacute;", "&Ecirc;", "&Euml;", "&Igrave;", "&Iacute;", "&Icirc;", "&Iuml;", "&ETH;", "&Ntilde;", "&Ograve;", "&Oacute;", "&Ocirc;", "&Otilde;", "&Ouml;", "&times;", "&Oslash;", "&Ugrave;", "&Uacute;", "&Ucirc;", "&Uuml;", "&Yacute;", "&THORN;", "&szlig;", "&agrave;", "&aacute;", "&acirc;", "&atilde;", "&auml;", "&aring;", "&aelig;", "&ccedil;", "&egrave;", "&eacute;", "&ecirc;", "&euml;", "&igrave;", "&iacute;", "&icirc;", "&iuml;", "&eth;", "&ntilde;", "&ograve;", "&oacute;", "&ocirc;", "&otilde;", "&ouml;", "&divide;", "&oslash;", "&ugrave;", "&uacute;", "&ucirc;", "&uuml;", "&yacute;", "&thorn;", "&yuml;", "&quot;", "&amp;", "&lt;", "&gt;", "&OElig;", "&oelig;", "&Scaron;", "&scaron;", "&Yuml;", "&circ;", "&tilde;", "&ensp;", "&emsp;", "&thinsp;", "&zwnj;", "&zwj;", "&lrm;", "&rlm;", "&ndash;", "&mdash;", "&lsquo;", "&rsquo;", "&sbquo;", "&ldquo;", "&rdquo;", "&bdquo;", "&dagger;", "&Dagger;", "&permil;", "&lsaquo;", "&rsaquo;", "&euro;", "&fnof;", "&Alpha;", "&Beta;", "&Gamma;", "&Delta;", "&Epsilon;", "&Zeta;", "&Eta;", "&Theta;", "&Iota;", "&Kappa;", "&Lambda;", "&Mu;", "&Nu;", "&Xi;", "&Omicron;", "&Pi;", "&Rho;", "&Sigma;", "&Tau;", "&Upsilon;", "&Phi;", "&Chi;", "&Psi;", "&Omega;", "&alpha;", "&beta;", "&gamma;", "&delta;", "&epsilon;", "&zeta;", "&eta;", "&theta;", "&iota;", "&kappa;", "&lambda;", "&mu;", "&nu;", "&xi;", "&omicron;", "&pi;", "&rho;", "&sigmaf;", "&sigma;", "&tau;", "&upsilon;", "&phi;", "&chi;", "&psi;", "&omega;", "&thetasym;", "&upsih;", "&piv;", "&bull;", "&hellip;", "&prime;", "&Prime;", "&oline;", "&frasl;", "&weierp;", "&image;", "&real;", "&trade;", "&alefsym;", "&larr;", "&uarr;", "&rarr;", "&darr;", "&harr;", "&crarr;", "&lArr;", "&uArr;", "&rArr;", "&dArr;", "&hArr;", "&forall;", "&part;", "&exist;", "&empty;", "&nabla;", "&isin;", "&notin;", "&ni;", "&prod;", "&sum;", "&minus;", "&lowast;", "&radic;", "&prop;", "&infin;", "&ang;", "&and;", "&or;", "&cap;", "&cup;", "&int;", "&there4;", "&sim;", "&cong;", "&asymp;", "&ne;", "&equiv;", "&le;", "&ge;", "&sub;", "&sup;", "&nsub;", "&sube;", "&supe;", "&oplus;", "&otimes;", "&perp;", "&sdot;", "&lceil;", "&rceil;", "&lfloor;", "&rfloor;", "&lang;", "&rang;", "&loz;", "&spades;", "&clubs;", "&hearts;", "&diams;"],
    arr2: ["&#160;", "&#161;", "&#162;", "&#163;", "&#164;", "&#165;", "&#166;", "&#167;", "&#168;", "&#169;", "&#170;", "&#171;", "&#172;", "&#173;", "&#174;", "&#175;", "&#176;", "&#177;", "&#178;", "&#179;", "&#180;", "&#181;", "&#182;", "&#183;", "&#184;", "&#185;", "&#186;", "&#187;", "&#188;", "&#189;", "&#190;", "&#191;", "&#192;", "&#193;", "&#194;", "&#195;", "&#196;", "&#197;", "&#198;", "&#199;", "&#200;", "&#201;", "&#202;", "&#203;", "&#204;", "&#205;", "&#206;", "&#207;", "&#208;", "&#209;", "&#210;", "&#211;", "&#212;", "&#213;", "&#214;", "&#215;", "&#216;", "&#217;", "&#218;", "&#219;", "&#220;", "&#221;", "&#222;", "&#223;", "&#224;", "&#225;", "&#226;", "&#227;", "&#228;", "&#229;", "&#230;", "&#231;", "&#232;", "&#233;", "&#234;", "&#235;", "&#236;", "&#237;", "&#238;", "&#239;", "&#240;", "&#241;", "&#242;", "&#243;", "&#244;", "&#245;", "&#246;", "&#247;", "&#248;", "&#249;", "&#250;", "&#251;", "&#252;", "&#253;", "&#254;", "&#255;", "&#34;", "&#38;", "&#60;", "&#62;", "&#338;", "&#339;", "&#352;", "&#353;", "&#376;", "&#710;", "&#732;", "&#8194;", "&#8195;", "&#8201;", "&#8204;", "&#8205;", "&#8206;", "&#8207;", "&#8211;", "&#8212;", "&#8216;", "&#8217;", "&#8218;", "&#8220;", "&#8221;", "&#8222;", "&#8224;", "&#8225;", "&#8240;", "&#8249;", "&#8250;", "&#8364;", "&#402;", "&#913;", "&#914;", "&#915;", "&#916;", "&#917;", "&#918;", "&#919;", "&#920;", "&#921;", "&#922;", "&#923;", "&#924;", "&#925;", "&#926;", "&#927;", "&#928;", "&#929;", "&#931;", "&#932;", "&#933;", "&#934;", "&#935;", "&#936;", "&#937;", "&#945;", "&#946;", "&#947;", "&#948;", "&#949;", "&#950;", "&#951;", "&#952;", "&#953;", "&#954;", "&#955;", "&#956;", "&#957;", "&#958;", "&#959;", "&#960;", "&#961;", "&#962;", "&#963;", "&#964;", "&#965;", "&#966;", "&#967;", "&#968;", "&#969;", "&#977;", "&#978;", "&#982;", "&#8226;", "&#8230;", "&#8242;", "&#8243;", "&#8254;", "&#8260;", "&#8472;", "&#8465;", "&#8476;", "&#8482;", "&#8501;", "&#8592;", "&#8593;", "&#8594;", "&#8595;", "&#8596;", "&#8629;", "&#8656;", "&#8657;", "&#8658;", "&#8659;", "&#8660;", "&#8704;", "&#8706;", "&#8707;", "&#8709;", "&#8711;", "&#8712;", "&#8713;", "&#8715;", "&#8719;", "&#8721;", "&#8722;", "&#8727;", "&#8730;", "&#8733;", "&#8734;", "&#8736;", "&#8743;", "&#8744;", "&#8745;", "&#8746;", "&#8747;", "&#8756;", "&#8764;", "&#8773;", "&#8776;", "&#8800;", "&#8801;", "&#8804;", "&#8805;", "&#8834;", "&#8835;", "&#8836;", "&#8838;", "&#8839;", "&#8853;", "&#8855;", "&#8869;", "&#8901;", "&#8968;", "&#8969;", "&#8970;", "&#8971;", "&#9001;", "&#9002;", "&#9674;", "&#9824;", "&#9827;", "&#9829;", "&#9830;"],
    HTML2Numerical: function (r) {
        return this.swapArrayVals(r, this.arr1, this.arr2);
    },
    NumericalToHTML: function (r) {
        return this.swapArrayVals(r, this.arr2, this.arr1);
    },
    numEncode: function (r) {
        if (this.isEmpty(r))
            return "";
        for (var e = [], a = r.length, i = 0; a > i; i++) {
            var t = r.charAt(i);
           var z= " " > t || t > "~" ? (e.push("&#"), e.push(t.charCodeAt()), e.push(";")) : e.push(t);
        }
        return e.join("");
    },
    htmlDecode: function (r) {
        var e,
            a,
            i = r;
        if (this.isEmpty(i))
            return "";
        if (i = this.HTML2Numerical(i), arr = i.match(/&#[0-9]{1,5};/g), null != arr)
            for (var t = 0; t < arr.length; t++)
                a = arr[t], e = a.substring(2, a.length - 1), i = e >= -32768 && 65535 >= e ? i.replace(a, String.fromCharCode(e)) : i.replace(a, "");
        return i;
    },
    htmlEncode: function (r, e) {
        return this.isEmpty(r) ? "" : (e = e || !1, e && (r = "numerical" == this.EncodeType ? r.replace(/&/g, "&#38;") : r.replace(/&/g, "&amp;")), r = this.XSSEncode(r, !1), "numerical" != this.EncodeType && e || (r = this.HTML2Numerical(r)), r = this.numEncode(r), e || (r = r.replace(/&#/g, "##AMPHASH##"), r = "numerical" == this.EncodeType ? r.replace(/&/g, "&#38;") : r.replace(/&/g, "&amp;"), r = r.replace(/##AMPHASH##/g, "&#")), r = r.replace(/&#\d*([^\d;]|$)/g, "$1"), e || (r = this.correctEncoding(r)), "entity" == this.EncodeType && (r = this.NumericalToHTML(r)), r);
    },
    XSSEncode: function (r, e) {
        return this.isEmpty(r) ? "" : (e = e || !0, e ? (r = r.replace(/\'/g, "&#39;"), r = r.replace(/\"/g, "&quot;"), r = r.replace(/</g, "&lt;"), r = r.replace(/>/g, "&gt;")) : (r = r.replace(/\'/g, "&#39;"), r = r.replace(/\"/g, "&#34;"), r = r.replace(/</g, "&#60;"), r = r.replace(/>/g, "&#62;")), r);
    },
    hasEncoded: function (r) {
        return /&#[0-9]{1,5};/g.test(r) ? !0 : /&[A-Z]{2,6};/gi.test(r) ? !0 : !1;
    },
    stripUnicode: function (r) {
        return r.replace(/[^\x20-\x7E]/g, "");
    },
    correctEncoding: function (r) {
        return r.replace(/(&amp;)(amp;)+/, "$1");
    },
    swapArrayVals: function (r, e, a) {
        if (this.isEmpty(r))
            return "";
        var i;
        if (e && a && e.length == a.length)
            for (var t = 0, c = e.length; c > t; t++)
                i = new RegExp(e[t], "g"), r = r.replace(i, a[t]);
        return r;
    },
    inArray: function (r, e) {
        for (var a = 0, i = e.length; i > a; a++)
            if (e[a] === r)
                return a;
        return -1;
    }
};

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

function GetChats()
{
    
    var ProfileUrl = "http://dev.imichat.co/imichatapi/";     
    try {
    var browserfingerprint = localStorage.getItem("browserfingerprint");
    browserfingerprint = (browserfingerprint == undefined || browserfingerprint == "") ? "" : localStorage.getItem("browserfingerprint");
   // var postData = "teamappid=" +localStorage.getItem("data-bind") + "&email=" + browserfingerprint + "&browserfingerprint=" + browserfingerprint + "&appid=" +localStorage.getItem("data-bind")  ;//+ "&threadid=" + IMIwidget.getThreadid();
    var postData = "teamappid=" + IMIwidget.clientId() + "&email=" +browserfingerprint+ "&browserfingerprint=" + browserfingerprint + "&appid=" + IMIwidget.appId() + "&threadid=" + IMIwidget.getThreadid();
    var profileAPI = ProfileUrl + "profile/GetChatThreads?"+postData;
    $.ajax({
        url: profileAPI,
        type: "GET",
        data: {},
        //dataType: "jsonp",
        contentType: "text/plain",
        success: function (data) {
            
            var jData = $.parseJSON(data);
            if (jData != null ) {
                
                $("#chatthreads").html('');
            $.each(jData, function (key,item) {
            try {
           
            //$("#chatthreads").prepend("<div>"+item.AGENTID+":"+item.MSG+"</div><br/>")
            if (item.CHATTYPE == "MO") {
                $("#chatthreads").prepend("<div  style=\"border: solid 1px black;\">"+item.AGENTID+" : "+item.MSG+"</div><br/>");
            }
            else
            {
                $("#chatthreads").prepend("<div style=\"border: solid 1px black;\">You :"+item.MSG+"</div><br/>");
            }
        
        }catch(e){}
        });
        $("#chatthreads").append('<div class="new-conversation"><a class="new-conv-btn" href="#" id="new-conv" onclick="return newconv()" >new-conversation</a><i class="error" id="icweStart"></i></div>');
    }
            
            console.log("success:" + data);
            //return data;
        },
        error: function (jqXHR, textStatus) {
            try {
                
                console.log(jqXHR);
                //alert(data);
            } catch (e) { }
        }
       });
    }catch(e){
        
        alert(e);
    }
}

function newconv()
{
    var ProfileUrl = "http://dev.imichat.co/imichatapi/";     
    $("#icwemail").val( localStorage.getItem("browserfingerprint"));
    $("#icwename").val( localStorage.getItem("browserfingerprint"));
    var pdata = "{\"customerid\": \"" + $.trim(localStorage.getItem("browserfingerprint")) + "\",\"email\": \"" + $.trim(localStorage.getItem("browserfingerprint")) + "\",\"name\": \"" + $.trim($("#icwname").val()) + "\",\"hostname\": \"" + IMIwidget.getDomain() + "\",\"mobileno\": \"" + $.trim($("#icwmobile").val()) + "\",\"teamappid\":\"" + IMIwidget.clientId() + "\"}";
        var profileAPI = ProfileUrl + "profile/create?jsonPcallback=?&data=" + pdata;
        $("#newconv").text("Please wait..");

        $.getJSON(profileAPI, function (result) { });
}

function bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener){
        element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
    }
}

bindEvent(window, 'message', function (e) {
   // results.innerHTML = e.data;
    alert(e.data);
});

function GetStyles()
{
var parser = document.createElement('a');
parser.href =document.referrer.hostname;
return localStorage.getItem("style_"+parser.hostname);
}