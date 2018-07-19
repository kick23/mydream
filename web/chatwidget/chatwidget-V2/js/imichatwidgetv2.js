/* for typing*/
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

var mtcolor = '';
var mocolor = '';
var mtTcolor = '';
var moTcolor = '';
var PreChatIconColor='';
var threadid = "";
var wcindiflag = true;
var counter = 0;
var topic = "imichat";
var IMILiveChat = function () {
    var ApplyStyles = function (msg) {
        var color = "";
        try {

            if (msg != '' && msg != undefined) {
                try {
                    msg = $.parseJSON(msg);
                    /* if (msg[0].showprevhist == 0) {
                         IMILiveChat.setshowprevhist(false);
                     } else {
                         IMILiveChat.setshowprevhist(true);
                     }*/

                    IMIGeneral.setSession("appid", msg.appid);
                    IMIGeneral.setSession("appkey", msg.clientkey);



                    color = msg.widgetcolor;
                    r = parseInt(color.substr(1, 2), 16);
                    g = parseInt(color.substr(3, 2), 16);
                    b = parseInt(color.substr(5, 2), 16);
                    hue = IMIGeneral.rgbToHsl(r, g, b)[0] * 360;
                    saturation = IMIGeneral.rgbToHsl(r, g, b)[1] * 100;
                    lightness = IMIGeneral.rgbToHsl(r, g, b)[2] * 100;

                    var lightness1 = lightness + 10;
                    var lightness2 = 95;
                    var lightness3 = 98;
                    var lightness4 = lightness + 10;
                    if (lightness > 80) { 
                        $(".mtcolor,.mocolor,.btn-togo,.icon-tickicon,.btn-secondary").css("color","#333333");
                        PreChatIconColor="#333333";
                        mtTcolor="#333333";
                        moTcolor="#333333";
                       // document.getElementsByClassName('widget-icon')[0].style.color="#333333"
                        $("#chatpageheading,#smallchatpageheading,#headerdesc,#smallheaderdesc,#aSend i,#headertypicallyrply,#addClass,#start-chat,#backicon,#minbutton,#dLabel,#btnsend").css("color","#333333");
                        $('.editor-paperclip i,.wdt-emoji-picker i').css("color", "#333333");
                    }else{
                        $(".mtcolor,.mocolor,.btn-togo,.icon-tickicon").css("color","#ffffff");
                        $('.btn-secondary').css('color', color);
                        PreChatIconColor="#ffffff";
                        mtTcolor="#ffffff";
                        moTcolor="#ffffff";
                        //document.getElementsByClassName('widget-icon')[0].style.color="#ffffff"
                        $("#chatpageheading,#smallchatpageheading,#headerdesc,#smallheaderdesc,#aSend i,#headertypicallyrply,#addClass,#start-chat,#backicon,#minbutton,#dLabel,#btnsend").css("color","#ffffff");
                        $('.editor-paperclip i,.wdt-emoji-picker i').css("color", color);
                    }
                    $('#divhead1').css({
                        'background-image': 'linear-gradient(to bottom,' + color + ' 0%, hsl(' + hue + ',' + saturation + '%,' + lightness1 + '%) 100%)'
                    });
                    $('#divhead1').css({
                        'background-image': '-webkit-linear-gradient(bottom,' + color + ' 0%, hsl(' + hue + ',' + saturation + '%,' + lightness1 + '%) 100%)'
                    });
                    $(".chatwindow").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness3 + "%)");

                    $(".widgetstarticon label").css("background", color);
                    $(".mtcolor").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness1 + "%)");
                    mtcolor = "hsl(" + hue + "," + saturation + "%," + lightness1 + "%)";
                    $(".mocolor").css("background", "hsl(" + hue + "," + saturation + "%," + lightness2 + "%)");
                    mocolor = "hsl(" + hue + "," + saturation + "%," + lightness2 + "%)";
                    if (msg.logo_path != null && msg.logo_path != '') {
                        $("#widgetlogo").attr("src", msg.logo_path);
                    } else {
                        $("#widgetlogo").hide();
                    }
                    $("#start-chat,.imichatwidget-body .modal-footer .btn-primary").css("background-color", color);
                    
                    $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
                    $(".agentimage>span").css("background", mocolor);

                    $('#aSendicon').css("background", "hsl(" + hue + "," + saturation + "%," + lightness1 + "%)");
                    $('#start-chat').text(msg.buttontext);
                    $('#start-chat').attr('data-text', msg.buttontext);
                    $("#start-chat").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness4 + "%)");
                    $("#start-chat").hover(function () {
                        $("#start-chat").css("background-color", color);
                    }).mouseout(function () {
                        $("#start-chat").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness4 + "%)");
                    });
                    $(".btn-togo").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness1 + "%)");
                    $(".widgetalerts").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness3 + "%)");
                    $(".nitesh-chat-box").css("border-top-color", "hsl(" + hue + "," + saturation + "%," + lightness1 + "%)");
                    //$(".chatwindow .editor-paperclip i").css("color", color);
                    $('#chatpageheading,#smallchatpageheading').text(msg.name);
                    $('#headerdesc,#smallheaderdesc').text(msg.bylinetext);
                    if (msg.ooo_msg.outoff_office_msg != undefined && msg.ooo_msg.outoff_office_msg != null && msg.ooo_msg.outoff_office_msg != '') {
                        $('.ooomsg-chat-div').css('display', 'block');
                        $('#oooMsg').text(msg.ooo_msg.outoff_office_msg);
                        $("#start-chat").attr("onclick", "#");
                        $("#start-chat").attr("disabled", "disabled");
                        $("#start-chat").addClass("btn-disabled");
                        $('.nitesh-chat-box').css('display', 'none');

                    } else {
                        if (msg.ooo_msg.agent_avail === 0) {
                            $('.ooomsg-chat-div').css('display', 'block');
                            $('#oooMsg').text('No Agent Available');

                            $('.nitesh-chat-box').css('display', 'none');
                            $("#start-chat").attr("onclick", "#");
                            $("#start-chat").attr("disabled", "disabled");
                            $("#start-chat").addClass("btn-disabled");
                            $("#start-chat").attr("title", "No Agent Available");

                        } else {
                            $('.ooomsg-chat-div').css('display', 'none');
                            $("#headertypicallyrply").css('display', 'block');
                            $("#start-chat").removeAttr("disabled");
                            $('.nitesh-chat-box').css('display', 'block');
                            $("#start-chat").attr("title", "");
                            $("#start-chat").attr("onclick", "IMILiveChat.startchat()");
                        }
                    }
                    if (msg.isemojienable == true) {
                        IMIGeneral.setSession('hdnisemojienable', '1');
                    } else {
                        IMIGeneral.setSession('hdnisemojienable', '0');
                    }

                    if (msg.waittime == null || msg.waittime == undefined || msg.waittime == '') {
                        $('#typicallyrply').css('display', 'none');
                        $('#icwagenthdr').removeClass('goup');
                    } else {
                        $('#typicallyrply').text(msg[0].waittime);
                        $('#icwagenthdr').addClass('goup');
                    }
                    if (msg.wt_type_enabled) {

                        if (msg.wt_type === 1) {
                            $("#headertypicallyrply").text("Typically replies in few minutes");
                            $("#smallheaderdesc").text("Typically replies in few minutes");
                        } else if (msg.wt_type === 2) {
                            $("#headertypicallyrply").text("Typically replies in few hours");
                            $("#smallheaderdesc").text("Typically replies in few hours");
                        } else if (msg.wt_type === 3) {
                            $("#headertypicallyrply").text("Typically replies in a day");
                            $("#smallheaderdesc").text("Typically replies in a day");
                        }
                    }

                } catch (ex) { }
                try {
                    pathArray = window.location.host.split('.');
                    var arrLength = pathArray.length;
                    var domainName = pathArray.slice(arrLength - 2, arrLength).join('.');
                    document.domain = domainName;
                } catch (e) { }

            } else {
                $('#start-chat').css('background-color', '');
            }
            IMILiveChat.registerRTM();
            IMILiveChat.loadPlugins(color);
        } catch (e1) {
            // debugger;
            //alert(e1.message);
        }
        var KeyValuePair = {
            "IP": "",
            "City": "",
            "Country": ""
        };
        if (msg != null) {
            if (msg.ip_stack_data != null) {
                KeyValuePair = {
                    "IP": msg.ip_stack_data.ip,
                    "City": msg.ip_stack_data.city,
                    "Country": msg.ip_stack_data.country_name
                };
            }
        }
        IMIGeneral.storeLocal('custom-profile-params', KeyValuePair);
        ////setTimeout(Timeout, 1000); CHAT-1182
        // document.getElementById("divloader").style.display = 'none';
        //document.getElementById("divaside").style.display = 'block';
    };
    var LoadPrevChats = function () {
        debugger;
        try {
            var browserfingerprint = localStorage.getItem("browserfingerprint");
            browserfingerprint = (browserfingerprint == undefined || browserfingerprint == "") ? "" : localStorage.getItem("browserfingerprint");
            // var postData = "teamappid=" +localStorage.getItem("data-bind") + "&email=" + browserfingerprint + "&browserfingerprint=" + browserfingerprint + "&appid=" +localStorage.getItem("data-bind")  ;//+ "&threadid=" + IMILiveChat.getThreadid();
            var postData = "teamappid=" + IMILiveChat.clientId() + "&email=" + browserfingerprint + "&browserfingerprint=" + browserfingerprint + "&appid=" + IMILiveChat.appId() + "&threadid=" + IMILiveChat.getCurrentThreadId();
            var profileAPI = IMIGeneral.profileUrl() + "profile/GetChatThreads?" + postData;
            $.ajax({
                url: profileAPI,
                type: "GET",
                data: {},
                //dataType: "jsonp",
                contentType: "text/plain",
                success: function (data) {

                    var jData = $.parseJSON(data);
                    if (jData != null && jData.length > 0) {

                        $("#chatthreads").html('');
                        var badgeCount = "";
                        $.each(jData, function (key, item) {
                            try {
                                badgeCount = "";
                                badgeCount = IMIGeneral.getLocal(localStorage.getItem("browserfingerprint") + "_" + item.FILTER + "_unreadcount");
                                if (badgeCount == undefined || badgeCount == null || badgeCount == "null" || badgeCount == "0") {
                                    badgeCount = "<span class='badge' style='display:none;'>" + badgeCount + "</span>";
                                } else {
                                    badgeCount = "<span class='badge'>" + badgeCount + "</span>";
                                }
                                //$("#chatthreads").prepend("<div>"+item.AGENTID+":"+item.MSG+"</div><br/>")
                                var tmpl = "<div class='thread' id='{4}' onclick='ShowChatMessages(this)'><div class='left'><h3><span class='agent-name'>{0}</span></h3><p>{1}</p></div>" +
                                    "<div class='right'><span class='time'>{2}</span>{3}</div></div>";
                                if (item.CHATTYPE == "MO") {
                                    var motmpl = tmpl;
                                    motmpl = motmpl.replace("{0}", item.AGENTID).replace("{1}", item.MSG).replace("{4}", item.FILTER).replace("{3}", badgeCount).replace("{2}", IMIGeneral.timeDifference(item.MSGDATE));
                                    $("#chatthreads").prepend(motmpl);
                                } else {
                                    var mttmpl = tmpl;
                                    mttmpl = mttmpl.replace("{0}", item.AGENTID).replace("{1}", item.MSG).replace("{4}", item.FILTER).replace("{3}", badgeCount).replace("{2}", IMIGeneral.timeDifference(item.MSGDATE));
                                    $("#chatthreads").prepend(mttmpl);
                                }

                            } catch (e) { }
                        });
                        $("#start-chat").html("New Conversation");
                        // $("#chatthreads").append('<div class="new-conversation"><a class="new-conv-btn" href="#" id="new-conv" onclick="return start-chat()" >new-conversation</a><i class="error" id="icweStart"></i></div>');
                    } else {
                        $("#chatthreads").html('');
                        $("#start-chat").html("Start Conversation");
                    }

                    console.log("success:" + data);
                    //return data;
                },
                error: function (jqXHR, textStatus) {
                    try {

                        console.log(jqXHR);

                    } catch (e) { }
                }
            });
        } catch (e) {

            //alert(e);
        }
    };
    var CreateThread = function (type) {
        var messaging = IMI.ICMessaging.getInstance();
        var createThreadCallBack = {
            onSuccess: function (thread) {

                if (thread) {
                    threadid = thread.getId();
                    IMILiveChat.setCurrentThreadId(threadid);
                    //alert(IMILiveChat.getCurrentThreadId());
                    debugger;
                    if (type == "newchat") {

                        $("#chat").show();
                        $("#chat_submit_box").show();
                        $("#chatthreads").hide();
                        $(".new-conversation").hide();
                        $("#dLabel").show();
                        $("#backicon").show();
                        $("#icwdivcarea").html('');
                        localStorage.setItem('is-first-mo-sent-{0}'.format(threadid), 0);

                        //startPrechatSurvey();
                    }
                } else {
                    console.log("failed to CreateThread:");
                    //IMILiveChat.startErrMsg("unable to connect");
                }
            },
            onFailure: function () {
                console.log("failed to CreateThread:");
                // IMILiveChat.startErrMsg("unable to connect");
            }

        };
        //messaging.createThread(steamid, threadtitle, createThreadCallBack);
        var threadObj = new IMI.ICThread();
        threadObj.setTitle(IMILiveChat.newThreadName());
        threadObj.setType(IMI.ICThreadType.Conversation);
        messaging.createThread(threadObj, createThreadCallBack);

    };
    var RegisterRTM = function () {
        var config = new IMI.ICConfig(IMILiveChat.appId(), IMILiveChat.appkey());
        IMI.IMIconnect.startup(config);

        var userId = IMILiveChat.getBrowserFingerprint();
        var deviceId = ""; //$("#deviceId").val();

        if (deviceId === "") {
            deviceId = IMI.ICDeviceProfile.getDefaultDeviceId();
        }
        console.log("deviceId:" + deviceId);
        deviceProfile = new IMI.ICDeviceProfile(deviceId, userId);

        console.log("userId:" + userId);
        console.log("IMILiveChat.appId():" + IMILiveChat.appId());
        //console.log("IMILiveChat.appkey():" + IMILiveChat.appkey());
        //var isRegistered = IMI.IMIconnect.isRegistered();
        //console.log(isRegistered);
        var regcallback = {
            onSuccess: function (msg) {
                var messaging = IMI.ICMessaging.getInstance();
                messaging.connect();
                console.log("conneted");
                CreateThread();
                ReciveMsg();
            },
            onFailure: function (err) {
                console.log(err);
                //enableStart("unable to connect");
                // IMILiveChat.startErrMsg("unable to connect");
            }
        };
        //if (!isRegistered) {
        //  IMI.IMIconnect.register($.trim(localStorage.getItem("browserfingerprint")), callback);
        IMI.IMIconnect.register(deviceProfile, regcallback);
        //}
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
            if (icMessage.thread.id == IMILiveChat.getCurrentThreadId()) {
                console.log("read message from icMessage obj");
                console.log(icMessage.userId);
                console.log(icMessage.getMessage());
                console.log(icMessage.getMedia());
                console.log(icMessage.getType());
                if (icMessage.getType() === IMI.ICMessageType.Republish) {
                    var thread = icMessage.getThread() || {};
                    if (icMessage.getMessage().indexOf("$$$$$ILOG$$$$$|") === 0) {
                        //closed
                        IMILiveChat.bindIlogMsg(message.getMessage(), "MSG", true);

                    } else if (icMessage.getMessage() === "$$$$CLOSECHAT$$$$") {
                        //closed
                        IMILiveChat.bindCloseMsg("Close", "MSG", false);

                    } else {
                        if (icMessage.getMedia()) {
                            var html = [];
                            var media = icMessage.getMedia();
                            for (var i = 0; i < media.length; i++) {
                                var m = media[i];
                                var contentType = m.getContentType();
                                var url = m.getURL();
                                IMILiveChat.bindMT("attachment|||" + contentType + "|||" + url, IMIGeneral.getUserTimezoneDateTime(icMessage.submittedAt), icMessage.transactionId, false, icMessage.extras.customtags.agent);

                            }
                            // if ($("#dicw_" + message.getTransactionId()).length === 0) {
                            if (document.getElementById("dicw_" + icMessage.getTransactionId()) == null) {
                                IMILiveChat.bindMT(icMessage.getMessage(), IMIGeneral.getUserTimezoneDateTime(icMessage.submittedAt), icMessage.transactionId, false, icMessage.extras.customtags.agent);
                            }
                        } else {
                            //if ($("#dicw_" + message.getTransactionId()).length === 0) {
                            if (document.getElementById("dicw_" + icMessage.getTransactionId()) == null) {
                                IMILiveChat.bindMT(icMessage.getMessage(), IMIGeneral.getUserTimezoneDateTime(icMessage.submittedAt), icMessage.transactionId, false, icMessage.extras.customtags.agent);
                            }
                        }
                    }
                } else {
                    try {
                        if (icMessage.userId == IMILiveChat.getUserId()) {
                            var agentid = icMessage.extras.customtags.agent;
                            var teamname = IMIGeneral.getSession("teamname");
                            if (icMessage.extras.customtags.teamname != null) {
                                teamname = icMessage.extras.customtags.teamname;
                            }
                            if (agentid.length > 0) {
                                if ($("#hdnicwagent").val() != agentid) {
                                    IMILiveChat.bindMsg(agentid, "MSG", teamname, false);
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
                                IMILiveChat.bindMO("attachment|||" + fi.getContentType() + "|||" + fi.getURL(), IMIGeneral.getUserCtime(), x + icMessage.transactionId, false, icMessage.extras.customtags.agent);

                            }
                        }
                    } catch (e) { }
                    if (icMessage.getMessage().indexOf("$$$$$ILOG$$$$$|") === 0) {
                        IMILiveChat.bindIlogMsg(icMessage.getMessage(), "MSG", false);
                    } else if (icMessage.getMessage() == "$$$$$TYPING$$$$$") {
                        if (icMessage.extras.customtags.typing == "typing_on") {
                            IMILiveChat.bindTypingMO("typing_on", false);
                            counter = 0;
                            tt = setInterval(function () {
                                startTime();
                            }, 1000);
                        } else if (icMessage.extras.customtags.typing == "typing_off") {
                            $(".divtypingindicator").remove();
                        }
                    } else {
                        IMILiveChat.bindMO(icMessage.getMessage(), IMIGeneral.getUserCtime(), icMessage.transactionId, false, icMessage.extras.customtags.agent);
                    }


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
            } else {
                IMILiveChat.SetThreadCount(icMessage.thread.id);
            }
            if (icMessage.getType() != IMI.ICMessageType.Republish && icMessage.getMessage().indexOf("$$$$$ILOG$$$$$|") != 0 && icMessage.getMessage() != "$$$$$TYPING$$$$$") {
                window.parent.postMessage({
                    height: 3,
                    msg: icMessage.getMessage(),
                    dt: IMIGeneral.getUserCtime(),
                    fingerprint: localStorage.getItem("browserfingerprint"),
                    msgtransid: icMessage.transactionId,
                    threadid: icMessage.thread.id
                }, "*");
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

        validDomain = "true";
        sessionStorage.setItem("tempsendmsg", $("#icwmsg").val().trim());
        $("#icwmsg").val("");
        var txtmsg = sessionStorage.getItem("tempsendmsg");
        if (txtmsg != '') {
            var messaging = IMI.ICMessaging.getInstance();
            console.log(messaging);
            var message = new IMI.ICMessage();

            message.setMessage(txtmsg);
            // message.setTopic(IMILiveChat.getTopic());
            console.log("local storage");
            for (i = 0; i < localStorage.length; i++) {
                console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
            }

            console.log("session storage");
            for (i = 0; i < sessionStorage.length; i++) {
                console.log(sessionStorage.key(i) + "=[" + sessionStorage.getItem(sessionStorage.key(i)) + "]");
            }
            var thread = new IMI.ICThread();
            //alert(IMILiveChat.getCurrentThreadId());
            //alert(IMILiveChat.getCurrentThreadName());
            thread.setId(IMILiveChat.getCurrentThreadId());
            thread.setTitle(IMILiveChat.getCurrentThreadName());
            //thread.setStreamName(IMILiveChat.getTopic());
            thread.setType(IMI.ICThreadType.Conversation);
            message.setThread(thread);

            try {
                var appid = IMILiveChat.clientId();
                var a = document.createElement('a');
                a.href = window.document.referrer;

                var jobj = {
                    // "name": IMIGeneral.getSession(appid + "_name"),
                    "Webpage": window.document.referrer.match(/[^\/]+$/)[0],
                    "Website": a.hostname,
                    // "mobileno": IMIGeneral.getSession(appid + "_mobile"),
                    //"emailid": IMIGeneral.getSession(appid + "_email"),
                    "browserfingerprint": localStorage.getItem("browserfingerprint"),
                    "customprofileparams": IMIGeneral.getLocal('custom-profile-params'),
                };

                message.setExtras(jobj);
                console.log(message);
            } catch (e) {
                console.log(e.message);
            }

            var callback = {
                onSuccess: function (msg) {
                    console.log("message sent");
                    $("#aSend").css('display', 'table');
                    $("#sendloading").css("display", "none");
                    $("#icwmsg").val(sessionStorage.getItem("tempsendmsg"));
                    IMILiveChat.bindMT(txtmsg, IMIGeneral.getUserCtime(), new Date().getTime(), false);

                    $("#icwmsg").val("");
                    if (localStorage.getItem('is-first-mo-sent-{0}'.format(threadid)) == 0) {
                        startPrechatSurvey();
                    }
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

    };
    var SendFile = function (url, type) {
        debugger;
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
        //  message.setTopic(IMILiveChat.getTopic());

        var thread = new IMI.ICThread();
        thread.setId(IMILiveChat.getThreadid());
        thread.setTitle("topic");
        thread.setType(IMI.ICThreadType.Conversation);
        ///thread.setStreamName(IMILiveChat.getTopic());
        message.setThread(thread);

        var callback = {
            onSuccess: function (msg) {
                debugger;
                console.log("message sent");
                IMILiveChat.bindMT("attachment|||" + type + "|||" + url, IMIGeneral.getUserCtime(), new Date().getTime(), false);
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
            var appid = IMILiveChat.clientId();
            var a = document.createElement('a');
            a.href = window.document.referrer;

            var jobj = {
                // "name": IMIGeneral.getSession(appid + "_name"),
                "Webpage": window.document.referrer.match(/[^\/]+$/),
                "Website": a.hostname,
                //  "mobileno": IMIGeneral.getSession(appid + "_mobile"),
                //  "emailid": IMIGeneral.getSession(appid + "_email"),
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

        //message.setTopic(IMILiveChat.getTopic());
        var thread = new IMI.ICThread();
        thread.setId(IMILiveChat.getCurrentThreadId());
        thread.setTitle(IMILiveChat.getCurrentThreadName());
        // thread.setStreamName(IMILiveChat.getTopic());
        thread.setType(IMI.ICThreadType.Conversation);
        message.setThread(thread);


        var callback = {
            onSuccess: function (msg) {
                debugger;
                console.log("close message sent");
                IMILiveChat.bindMT($("#icwmsg").val(), IMIGeneral.getUserCtime(), new Date().getTime(), false);
                $("#icwmsg").val("");
                $(".error").html("");
                LoadPrevChats();
                $("#chat").hide();
                $("#chat_submit_box").hide();
                $("#chatthreads").show();
                $("#new-conversation").show();
                $("#dLabel").hide();
                $("#backicon").hide();
                /*
                 //var startbuttontext = IMILiveChat.getSession("buttontext");
                 $("#start-chat").text($('#start-chat').attr('data-text'));
                 IMILiveChat.clearSession();
                 sessionStorage.setItem("data-bind", IMILiveChat.getQueryString(location.href, "id"));
                 sessionStorage.setItem("data-org", IMILiveChat.getQueryString(location.href, "org"));
                 $('.chatwindow2').fadeToggle(200, 'linear');
                 $('.open-btn').addClass('close-btn');
                 $('.chatwindow1').show();
                 $('.chatwindow2').hide();
                 $("#addClass").addClass('state1');
                 $("#addClass").removeClass('state2');
     
                 IMILiveChat.deleteCookie(IMILiveChat.clientId() + "_username");
                 IMILiveChat.deleteCookie(IMILiveChat.clientId() + "_email");
                 IMILiveChat.deleteCookie(IMILiveChat.clientId() + "_mobno");*/

            },
            onFailure: function (errormsg) {
                console.log("failed to close chat");
                console.log(errormsg);
                //var startbuttontext = IMILiveChat.getSession("buttontext");
                $("#start-chat").text($('#start-chat').attr('data-text'));

            }

        };
        console.log(messaging.isConnected());
        messaging.publishMessage(message, callback);
    };
    var GetWCPreviousHistory = function () {
        try {
            // debugger;
            var browserfingerprint = localStorage.getItem("browserfingerprint");
            browserfingerprint = (browserfingerprint == undefined || browserfingerprint == "") ? "" : localStorage.getItem("browserfingerprint");
            var postData = "teamappid=" + IMILiveChat.clientId() + "&email=" + browserfingerprint + "&browserfingerprint=" + browserfingerprint + "&appid=" + IMILiveChat.appId() + "&threadid=" + IMILiveChat.getCurrentThreadId();
            //var postData = "teamappid=" + IMILiveChat.clientId() + "&email=" + IMILiveChat.getUserId() + "&browserfingerprint=" + browserfingerprint + "&appid=" + IMILiveChat.appId() + "&threadid=" + IMILiveChat.getThreadid();
            var validateAPI = IMIGeneral.profileUrl() + "profile/GetPreviousChatHistory?" + postData;
            $.ajax({
                url: validateAPI,
                type: "GET",
                data: {},
                success: function (data) {
                    if (data != null && data.length > 0) {
                        IMIGeneral.storeLocal(localStorage.getItem("browserfingerprint") + "_" + IMILiveChat.getCurrentThreadId() + "_unreadcount", 0);
                        data = $.parseJSON(data);
                        $.each(data, function (key) {
                            try {
                                var message = data[key];
                                if (message.ALIASFILTER == localStorage.getItem("browserfingerprint")) {
                                    if (message.CHATTYPE == "MO") {
                                        if (message.CONTENTTYPE != "" && message.PATH != "") {
                                            IMILiveChat.bindMT("attachment|||" + message.CONTENTTYPE + "|||" + message.PATH, IMIGeneral.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false, message.fullname);
                                        }
                                        IMILiveChat.bindMT(message.MSG, IMIGeneral.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false);
                                    }
                                    if (message.CHATTYPE == "MT" || message.CHATTYPE == "OO" || message.CHATTYPE == "AR") {
                                        if (message.CONTENTTYPE != "" && message.PATH != "") {
                                            IMILiveChat.bindMO("attachment|||" + message.CONTENTTYPE + "|||" + message.PATH, IMIGeneral.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false, message.fullname);
                                        }
                                        IMILiveChat.bindMO(message.MSG, IMIGeneral.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false, message.fullname);
                                    }
                                    if (message.CHATTYPE == "ILOG") {
                                        // if (message.CONTENTTYPE != "" && message.PATH != "") {
                                        IMILiveChat.bindIlogMsg(message.MSG, IMIGeneral.getUserTimezoneDateTime(message.DATE_CREATE), false);
                                        // IMILiveChat.bindMO("attachment|||" + message.CONTENTTYPE + "|||" + message.PATH, IMILiveChat.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false);
                                        // }
                                        //IMILiveChat.bindMO(message.MSG, IMILiveChat.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false);
                                    }
                                }
                            } catch (e) { }
                        });
                        if (localStorage.getItem('is-first-mo-sent-{0}'.format(threadid)) == 0) {
                            startPrechatSurvey();
                        }
                    }
                },
                error: function (data) {
                    console.log(data);
                    ////alert(data);
                    return data;
                }

            });
        } catch (e) { }
    };
    var GetStyles = function (attrkey, hostname) {
        debugger;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var cmsg = this.responseText;
                ////widgetStyle1(cmsg);
                window.parent.postMessage({
                    message: cmsg,
                    action: 'loadstyles'
                }, "*");
                ApplyStyles(cmsg);
            }
        };
        var url = IMIGeneral.profileUrl() + "livechats/" + attrkey + "/settings?host=" + hostname + "&$callback=?";
        xhttp.open("GET", url, true);
        xhttp.send();
    };
    var setwcindicator = function (sender_action) {
        try {
            if ($.trim($("#icwmsg").val()) == "") {
                return;
            }
            var postData = "hostname=" + IMIGeneral.getDomain() + "&teamappid=" + IMILiveChat.clientId() + "&browserfingerprint=" + localStorage.getItem("browserfingerprint") + "&istyping=" + sender_action + "&appid=" + IMILiveChat.appId() + "&threadid=" + IMILiveChat.getThreadid();
            var validateAPI = IMIGeneral.profileUrl() + "profile/GetTypingIndicator?" + postData + "&$callback=?";
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
    return {
        init: function () {
            debugger;
            $('#icwmsg').on("keydown", function (e) {
                var charCode = (e.which) ? e.which : e.keyCode;
                if (charCode == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    debugger;
                    $('#aSendicon').click();
                }
            });
            var browserName = IMIGeneral.getBrowserName();

            if (browserName != "chrome" && browserName != "firefox" &&
                browserName != "safari" && browserName != "edge" &&
                browserName != "ie" && browserName != "opera") {

                if (!IMIGeneral.detectIE() && !IMIGeneral.detectIOS()) {
                    $("body").html("<i class='fa fa-info-circle'></i><p class ='anothererror'>This browser is not supported. Kindly use Chrome/Firefox</p>");
                    return;
                }
            }
            IMIGeneral.clearSession();
            sessionStorage.setItem("data-bind", IMIGeneral.getQueryString(location.href, "id"));
            sessionStorage.setItem("data-org", IMIGeneral.getQueryString(location.href, "org"));
            $("#icworg").html("<br>with " + IMILiveChat.orgName());
            $("#divicwmaincontainer").show();
            $("#icworganization").html(decodeURIComponent(IMIGeneral.getQueryString(location.href, "org")));
            $("#icwagenthdr").html(IMIGeneral.getQueryString(location.href, "org"));
            $("#icwmsg").keyup(function (e) {
                IMILiveChat.wcindicator(e, this);
            });
            $('#icwmsg').donetyping(function () {
                IMILiveChat.wcindicatorclear();
            }, 10000);

            $("#opttranscript").click(function () {
                sendtranscript();
            });
            /*for identifying unique chats*/
            try {
                if (localStorage.getItem("browserfingerprint") == null || localStorage.getItem("browserfingerprint") == undefined || localStorage.getItem("browserfingerprint") == "") {
                    localStorage.setItem("browserfingerprint", IMIGeneral.getUniqueID());
                    IMIGeneral.setSession(IMILiveChat.clientId() + "_email", localStorage.getItem("browserfingerprint").toLowerCase());
                }
            } catch (e) {
                console.log("##error::" + e.message);
            }
            // debugger;
            ApplyStyles(localStorage.getItem("style_" + IMIGeneral.getHostName()));
            this.registerRTM();

            LoadPrevChats();
            $('.chatwindow1').show();
            $('.chatwindow2').hide();
            // CreateThread();
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
        getBrowserFingerprint: function () {
            return localStorage.getItem("browserfingerprint");
        },
        wcindicator: function (e, ctrl) {
            debugger;
            var length = $(ctrl).val().length;
            if (wcindiflag && length > 4) {
                setwcindicator("typing_on");
                wcindiflag = false;
            }
        },
        wcindicatorclear: function () {
            if (!wcindiflag) {
                setwcindicator("typing_off");
                wcindiflag = true;
            }
        },
        sendtranscript: function () { },
        getCurrentThreadId: function () {
            return IMIGeneral.getSession(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_" + IMIGeneral.getHostName());

        },
        setCurrentThreadId: function (threadId) {
            //return  IMIGeneral.setSession(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_"+IMIGeneral.getHostName(),threadId);
            sessionStorage.setItem(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_" + IMIGeneral.getHostName(), threadId);
        },
        setCurrentThreadName: function (threadName) {
            // IMIGeneral.setSession(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_"+IMIGeneral.getHostName()+"_name",threadName);
            sessionStorage.setItem(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_" + IMIGeneral.getHostName() + "_name", threadName);
        },
        getCurrentThreadName: function () {
            return IMIGeneral.getSession(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_" + IMIGeneral.getHostName() + "_name");
        },
        newThreadName: function () {
            var threadName = IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_" + IMIGeneral.getHostName() + "_" + IMIGeneral.ticks();
            IMILiveChat.setCurrentThreadName(threadName);
            return threadName;
        },
        registerRTM: function () {
            RegisterRTM();
        },
        startchat: function () {
            debugger;
            IMILiveChat.createThread("newchat");

        },
        send: function () {
            try {
                if ($(".wdt-emoji-picker").hasClass("wdt-emoji-picker-open")) {
                    $(".wdt-emoji-picker").removeClass("wdt-emoji-picker-open");
                    $(".wdt-emoji-popup").removeClass("open");
                    $(".icon-happy").removeClass("active");

                }
            } catch (y) { }
            debugger;
            SendMessage();
        },
        getThreadid: function () {
            return threadid;
        },
        getUserId: function () {
            return sessionStorage.getItem(IMILiveChat.clientId() + "_email");
        },
        createThread: function (type) {
            CreateThread(type);
        },
        loadPrevChats: function () {
            LoadPrevChats();
        },
        getWCPreviousHistory: function () {

            GetWCPreviousHistory();
        },
        bindMO: function (msg, dt, transid, isPrepend, agentid) {
            $(".divtypingindicator").remove();
            if (msg != "" && msg != undefined && msg != null && msg != "null") {
                if (msg == "$$$$$TYPING$$$$$") {
                    return;
                }
                var emojisingle = " ";
                if (msg.indexOf("attachment|||") == 0) {
                    var fileData = msg.split("|||");
                    IMILiveChat.bindFile(fileData[1], fileData[2], "MO", dt, transid, isPrepend);
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
                    msg = IMIGeneral.replaceurlintext(msg);
                    try {
                        msg = wdtEmojiBundle.render(msg);
                    } catch (e) { }
                    if (agentid != null && agentid != '') {
                        agentid = agentid.charAt(0);
                    } else {
                        agentid = "A";
                    }
                    // if ($("#dicw_" + transid).length == 0) {
                    if ($("#dicw_" + transid).length == 0) {
                        var moTmpl = "<div class=\"chat_message_wrapper chat_message_left\" data-trans=\"" + transid + "\" id=\"dicw_" + transid + "\"><ul class=\"chat_message " + emojisingle + "\">" +
                            "<li class='agentimage'><span>" + agentid + "</span></li><li  class='mocolor'><p>" + msg + "</p></li><span class=\"chat_message_time\"><span class=\"text\">Received</span>" + dt + "</span></ul></div>";

                        if (isPrepend)
                            $("#icwdivcarea").prepend(moTmpl);
                        else
                            $("#icwdivcarea").append(moTmpl);
                        // $("#icwdivcarea").prepend(moTmpl);
                        $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
                    }
                    $('.mocolor').css('background', mocolor);
                    $('.agentimage>span').css('background', mocolor);

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
                    $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
                }
            } catch (ex) { }
        },
        bindMT: function (msg, dt, transid, isPrepend, agentid) {
            debugger;
            if (msg != "" && msg != undefined && msg != null && msg != "null") {
                var oldMsg = msg;
                $(".divtypingindicator").remove();
                if (msg.indexOf("attachment|||") == 0) {
                    var fileData = msg.split("|||");
                    IMILiveChat.bindFile(fileData[1], fileData[2], "MT", dt, transid, isPrepend);
                    $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
                } else {
                    msg = Encoder.htmlEncode(msg);
                    var temp = msg;
                    var count = 0;
                    var emojisingle = " ";
                    if (msg.split(':').length > 1 || msg.split('<').length > 1 || msg.split(')').length > 1 || msg.split(';').length > 1) {
                        try {

                            var icons = IMILiveChat.emojiIcons();
                            msg.replace(/[:;83B>^)*@$&I\]|\-_(=o)pPxXDyOCcb:)]+/g, function (match) {
                                typeof icons[match] != 'undefined' ? count = IMILiveChat.getCount(match, msg, count) : null;
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

                    msg = IMIGeneral.replaceurlintext(msg);
                    if (IMIGeneral.getSession('hdnisemojienable') == "1") {
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

                        $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
                        $('.mtcolor').css('background', mtcolor);
                        if (mtcolor != '')
                            $('.mtcolor').css('color', mtTcolor);
                        // if (localStorage.getItem("tsemail") == IMILiveChat.getUserId()) {
                        //     $("#opttranscript").css("display", "block");
                        // }
                    }
                }
                //disable the click of your clickable area
                $(".dz-hidden-input").prop("disabled", true);
            }
        },
        bindFile: function (contentType, url, msgType, dt, transid, isPrepend) {
            try {
                if (url != "") {
                    if (msgType == "MO") {
                        var cntType = url.substr(url.lastIndexOf(".") + 1)
                        if (cntType == "jpg" || cntType == "gif" || cntType == "png") {
                            contentType = "image;"
                        } else {
                            contentType = "file";
                        }
                        try {
                            var url = url.replace(/\\/g, "/");
                            var uploadMsg = url.substr(url.lastIndexOf("/") + 1, url.length);
                        } catch (x) { }

                        //if ($("#dicw_" + transid + "_" + uploadMsg).length == 0) {
                        if (document.getElementById("dicw_" + transid + "_" + uploadMsg) == null) {
                            if (contentType == "image") {
                                var moTmpl = "<div class=\"chat_message_wrapper chat_message_left\" id=\"dicw_" + transid + "_" + uploadMsg + "\"  data-trans=\"" + transid + "\"><ul class=\"chat_message attachimage\"><li class=\"moindicatoricon\"><span class=\"icon-headset\"></span></li><li><a onclick=\"IMIwidget.checkFileExist('" + url + "')\" class=\"image-a\"> <img src=\"" + url + "\" onerror=\"this.src='" + IMILiveChat.domainName() + "images/noimagefound.png'\"><span class=\"icon-dwnimg\"></span></a>" + "</li><span class=\"chat_message_time\"><span class=\"text\">Received</span>" + dt + "</span></ul></div>";
                            } else {
                                var moTmpl = "<div class=\"chat_message_wrapper chat_message_left\"  id=\"dicw_" + transid + "_" + uploadMsg + "\" data-trans=\"" + transid + "\"><ul class=\"chat_message\"><li class=\"moindicatoricon\"><span class=\"icon-headset\"></span></li><li><a onclick=\"IMIwidget.checkFileExist('" + url + "')\" class=\"image-file\"> <i class=\"icon-attachment\"></i><span class=\"file-name\">" + uploadMsg + "</span></a></li>" + "<span class=\"chat_message_time\"><span class=\"text\">Received</span>" + dt + "</span></ul></div>";
                            }
                            if (isPrepend)
                                $("#icwdivcarea").prepend(moTmpl);
                            else
                                $("#icwdivcarea").append(moTmpl);
                            $('#chat').scrollTop($('#chat')[0].scrollHeight);
                        }
                    }
                    if (msgType == "MT") {
                        try {
                            var uploadMsg = url.substr(url.lastIndexOf("/") + 1, url.length);
                            uploadMsg = uploadMsg.substr(uploadMsg.indexOf("_") + 1, uploadMsg.length);
                        } catch (x) { }

                        //  if ($("#dicw_" + transid + "_" + uploadMsg).length == 0) {
                        if (document.getElementById("dicw_" + transid + "_" + uploadMsg) == null) {
                            if (contentType == "image") {
                                var mtTmpl = "<div class=\"chat_message_wrapper chat_message_right\"  id=\"dicw_" + transid + "_" + uploadMsg + "\" data-trans=\"" + transid + "\"><ul class=\"chat_message attachimage\"><li><a onclick=\"IMIwidget.checkFileExist('" + url + "')\" class=\"image-a\"> <img src=\"" + url + "\"  onerror=\"this.src='" + IMIGeneral.domainName() + "images/noimagefound.png'\"><span class=\"icon-dwnimg\"></span></a></li>" + "<span class=\"chat_message_time\"><span class=\"text\">Sent</span>" + dt + "</span></ul></div>";
                            } else {
                                var mtTmpl = "<div class=\"chat_message_wrapper chat_message_right\" id=\"dicw_" + transid + "_" + uploadMsg + "\"  data-trans=\"" + transid + "\"><ul class=\"chat_message\"><li><a onclick=\"IMIwidget.checkFileExist('" + url + "')\" class=\"image-file\"> <i class=\"icon-attachment\"></i><span class=\"file-name\">" + uploadMsg + "</span></a></li>" + "<span class=\"chat_message_time\"><span class=\"text\">Sent</span>" + dt + "</span></ul></div>";
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
                url: IMILiveChat.domainName() + "Handlers/ICWUpload.ashx?action=checkattachment",
                data: "filelink=" + filelink,
                async: false,
                success: function (msg) {
                    if (msg == "1")
                        window.open(filelink);
                    else
                        window.open(IMILiveChat.domainName() + "404.htm");
                },
                error: function (xhr, err, thrownError) {
                    console.log("error in checking file existence:" + err);
                }
            });
        },
        bindMsg: function (msg, type, teamname, isPrepend) {
            var mtTmpl = "<span class=\"servicemsg\"> You are now chatting with <span class=\"serviceuser\">" + msg + "</span> from " + teamname + " </span>";
            // IMIwidget.getSession("teamname") + " --</span>";
            if (isPrepend) {
                $("#icwdivcarea").prepend(mtTmpl);
            }
            else {
                $("#icwdivcarea").append(mtTmpl);
            }
            //  $("#icwdivcarea").append(mtTmpl);
            $('#chat').scrollTop($('#chat')[0].scrollHeight);
            $("#chatpageheading,#smallchatpageheading").text(msg);
            $("#headertypicallyrply,#smallheaderdesc").css("display", "none");
            //$("#typicallyrply").css("display", "none");
            $('#icwagenthdr').removeClass('goup');
        },
        loadPlugins: function (color) {
            ////alert($('#hdnisemojienable').val() );

            if (IMIGeneral.getSession('hdnisemojienable') == "1") {
                $(".wdt-emoji-popup").css("display", "block");
                wdtEmojiBundle.defaults.type = 'emojione';
                wdtEmojiBundle.defaults.emojiSheets.emojione = IMIGeneral.emojiImageURL();
                $("#icwmsg").addClass("wdt-emoji-bundle-enabled");
                wdtEmojiBundle.init('.wdt-emoji-bundle-enabled');
                $(".icon-happy").blur(function () {
                    // //alert(1);
                });
                //emojis end
                $(".wdt-emoji-picker .icon-happy").css("color", color);
            } else {
                if ($(".wdt-emoji-picker").hasClass("wdt-emoji-picker-open")) {
                    $(".wdt-emoji-picker").removeClass("wdt-emoji-picker-open");
                    $(".wdt-emoji-popup").removeClass("open");
                    $(".icon-happy").removeClass("active");
                    $(".error").html("");
                }
            }
            //DropZone starts
            //if ($("#chat").hasClass("dz-clickable"))
            //    return;
            Dropzone.autoDiscover = false;
            $("#chat").dropzone({
                maxFilesize: 10,
                url: IMIGeneral.domainName() + "/Handlers/ICWUpload.ashx?action=senduploadfile",
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

        },
        confirm: function () {
            Confirm();
        },
        close: function () {
            CloseChat();
        },
        emojiIcons: function () {
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
            return icons;
        },
        moveback: function () {          
            var lcStyle = IMIGeneral.getLocal("style_" + IMIGeneral.getDomain());
            lcStyle = $.parseJSON(lcStyle);
            $("#chatpageheading,#smallchatpageheading").text(lcStyle.name);

            $("#icwmsg").val("");
            $(".error").html("");
            LoadPrevChats();
            $("#chat").hide();
            $("#chat_submit_box").hide();
            $("#chatthreads").show();
            $(".new-conversation").show();
            $("#dLabel").hide();
            $("#backicon").hide();
            /* $("#headerdesc").text(localStorage.getItem("headerdesc"));*/
            if ($(".small").is(":visible") == false) {
                $(".small").hide();
                $(".big").show();
            }
        },
        minWindow: function () {
            window.parent.postMessage({
                height: 2
            }, "*");
        },
        SetThreadCount: function (threadid) {
            var threadMsgCount = IMIGeneral.getLocal(localStorage.getItem("browserfingerprint") + "_" + threadid + "_unreadcount");
            if (threadMsgCount == null || threadMsgCount == undefined || threadMsgCount == "null") {
                threadMsgCount = 0;

            }
            IMIGeneral.storeLocal(localStorage.getItem("browserfingerprint") + "_" + threadid + "_unreadcount", parseInt(threadMsgCount) + 1);
            $("#" + threadid).find(".badge").text(parseInt(threadMsgCount) + 1).show();
        },
        hideCloseButton: function () {
            $("#minbutton").hide();
            $("#minbutton").attr("onclick", "");
        },
        showFileUpload: function () {
            $(".dz-hidden-input").prop("disabled", false);
            $('#chat').click();

        },
        getStyles: function (attrkey, host) {
            GetStyles(attrkey, host);
        },
    };


}(jQuery);
//IMILiveChat.init();

function jsonPcallback(msg) {
    // debugger;
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
                        IMIGeneral.setSession("appid", appid);
                        IMIGeneral.setSession("appkey", appData.clientkey);
                        IMIGeneral.setSession("teamname", appData.teamname);
                        $("#icworganization").html(appData.oraganization);
                        IMILiveChat.registerRTM();
                        ////alert($('.wdt-emoji-picker').length);

                        /* if (localStorage.getItem("tsemail") != IMILiveChat.browserfingerprint()) {
                             $('#opttranscript').css("display", "none");
                         }*/
                    } else {
                        // IMILiveChat.startErrMsg("unable to register");
                        $("#start-chat").attr('disabled', false);
                        $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
                    }
                    RegisterRTM();
                } else if (jData.statusCode == "2401") {
                    //IMILiveChat.startErrMsg("You are not authorized to use this service.");
                    $("#start-chat").attr('disabled', false);
                    $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
                } else {
                    //IMILiveChat.startErrMsg("unable to register");
                    $("#start-chat").attr('disabled', false);
                    $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
                }

            } else {
                // IMILiveChat.startErrMsg("unable to register");
                $("#start-chat").attr('disabled', false);
                $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
            }

        } else {
            // IMILiveChat.startErrMsg("unable to register");
            $("#start-chat").attr('disabled', false);
            $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
        }
    } catch (e1) {
        // IMILiveChat.startErrMsg("unable to connect");
        $("#start-chat").attr('disabled', false);
        $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
    }
}

function ShowChatMessages(ctrl) {
    // debugger;
    LoadChat($(ctrl).attr("id"));

}

function LoadChat(threadid) {
    $('#icwdivcarea').html('');
    IMILiveChat.setCurrentThreadId(threadid);
    IMILiveChat.getWCPreviousHistory();
    $("#chat").show();
    $("#chat_submit_box").show();
    $("#dLabel").show();
    $("#backicon").show();
    $("#chatthreads").hide();
    $("#new-conversation").hide();
}