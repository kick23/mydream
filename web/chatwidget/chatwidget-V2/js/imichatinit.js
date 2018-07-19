var body = document.getElementsByTagName('body')[0];

var script = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
})();
var fullUrl = script.src;
var script = document.createElement('script');
script.src = fullUrl.toLowerCase().replace('imichatinit.js', 'imichatgeneral.js');
script.type = 'text/javascript';
body.appendChild(script);
//document.getElementById("divicw").innerHTML = LoadHtml();
window.onload = LoadHtml;//LoadwidgetStyles;
// document.getElementById("divicw").onload =  function() {LoadwidgetStyles();};
var buttonType = "type1";
function LoadHtml() {
    try {
        var docwidth = document.body.clientWidth;
        document.getElementById("divicw").innerHTML = "<link rel=\"stylesheet\" href=\"" + IMIGeneral.domainName() + "/css/chat-widget.css?id=" + IMIGeneral.ticks() + "\" />" +
        "<link rel=\"stylesheet\" href=\"" + IMIGeneral.domainName() + "/css/style.css?id=" + IMIGeneral.ticks() + "\" />" +
        "<iframe class=\"chatbutton\" id=\"imi-chatbutton\" name\"IMIchat Chatting button\">" +
            "</iframe>" +
             "<div class=\"main-unreadchat-cont\" id=\"divcardheight\"><iframe class=\"chatunread-frame\"  id=\"chatunread-frame\" allowtransparency=\"true\" name=\"Chat Unread message\"></iframe></div>" +
            "<div class=\"main-chat-cont\" id=\"divchatmain\" style=\"display:none;\"> <div class=\"main-chat-cont-sub\">" +
           // "<iframe class=\"tabbed_sidebar ng-scope start-page chatwindow1-cont\" id=\"divchataside\" ></iframe>" +
            "<iframe class=\"chatwindow-frame\" name=\"IMIchat chat window\" id=\"divchataside\"  src=\"" + IMIGeneral.domainName() + "/widgetloader.html?docwidth=" + docwidth + "&id=" + document.getElementById("divicw").getAttribute("data-bind") + "&org=" + document.getElementById("divicw").getAttribute("data-org") + "\"></iframe>" +
            "</div></div>";
        //            "</div>";
        LoadwidgetStyles();
    } catch (e) { }
}

function LoadwidgetStyles() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //document.write("<scipt>" + this.responseText + "</script>");
            //this.responseText;

            var cmsg = this.responseText;
            // cmsg = JSON.stringify(cmsg);

            widgetStyle1(cmsg);
        }
    };
    //livechats/{serviceKey}/settings
    //var url = IMIGeneral.profileUrl() + "profile/GetWebchatStyles?teamappid=" + document.getElementById("divicw").getAttribute("data-bind") + "&$callback=?";
    var url = IMIGeneral.profileUrl() + "livechats/" + document.getElementById("divicw").getAttribute("data-bind") + "/settings?host=" + window.location.hostname + "&$callback=?";
    xhttp.open("GET", url, true);
    xhttp.send();
}

function widgetStyle1(msg) {
    try {
        if (msg != '' && msg != undefined) {
            var destination = document.getElementById('divchataside').contentWindow;
            destination.postMessage(msg, "*");
            msg = JSON.parse(msg);
            buttonType = msg.button_shape;
            var badgecount = " <span class=\"badge\" id=\"chattotalbadge\"{0}>{1}</span> ";
            if (localStorage.getItem(localStorage.getItem("fingerprint") + "_badgecount") != null) {
                var count = localStorage.getItem(localStorage.getItem("fingerprint") + "_badgecount");
                if (count > 0) {
                    badgecount = badgecount.replace("{0}", "style=\"display:block;\"").replace("{1}", count);
                }
                else {
                    badgecount = badgecount.replace("{0}", "style=\"display:none;\"").replace("{1}", "");
                }
            }
            else {
                badgecount = badgecount.replace("{0}", "style=\"display:none;\"").replace("{1}", "");
            }
            var doc = document.getElementById('imi-chatbutton').contentWindow.document;
            doc.open();
            /*  doc.write("<style> .open-btn span {position: absolute;width: 21px;height: 21px;top: 0;bottom: 0;left: 0;right: 0;margin: auto;}"+
              ".open-btn{border-radius:50%;color:#ffffff!important;text-align:center;background-color:#00b0f0;border:0 solid #cdcdcd;display:block;margin:0 0 0;text-decoration:none!important;font-family:imichat-icomoon;text-transform:none;height:60px;width:60px;position:fixed;bottom:10px;right:10px;font-size:18px;box-shadow:0 1px 2px 0 rgba(0,0,0,.2);z-index:9999999}"+
              ".open-btn .icon-headset:before{content:\"\\e905\"}.open-btn.close-btn .icon-headset:before{content:\"\\e90a\"}.open-btn span{position:absolute;width:21px;height:21px;top:0;bottom:0;left:0;right:0;margin:auto}</style>"+*/
            doc.write("<link rel=\"stylesheet\" href=\"" + IMIGeneral.domainName() + "/css/style.css?id=" + IMIGeneral.ticks() + "\" />" +
           "<link rel=\"stylesheet\" href=\"" + IMIGeneral.domainName() + "/css/chat-widget-frame.css?id=" + IMIGeneral.ticks() + "\" />" +
            "<a class=\"open-btn state1 " + buttonType + "\" id=\"addClass\" onclick=\"parent.chatswitchicon()\" title=\"Chat button\" role=button>" + badgecount + "<span class=\"widget-icon\"></span></span></a><script>" +
            "document.getElementById(\"addClass\").style.backgroundColor ='" + msg.button_color + "';" +
            "document.getElementById(\"addClass\").style.backgroundColor ='" + msg.widgetcolor + "';" +
            "document.getElementById(\"addClass\").style.display = 'block';</script>");
            doc.close();
            /* for test */
            var doc1 = document.getElementById('chatunread-frame').contentWindow.document;
            doc1.open();
            doc1.write("<link rel=\"stylesheet\" href=\"" + IMIGeneral.domainName() + "/css/previewstyle.css?id=" + IMIGeneral.ticks() + "\" />" +
                "<style>div.msg{background-color:" + msg.widgetcolor + ";} div.msg::after,div.msg::before{content:'';border: solid transparent;border-color: rgba(194, 225, 245, 0);border-top-color: " + msg.widgetcolor + ";} .imichatpreview-msg-clearbtn{color:" + msg.widgetcolor + ";} </style><html class=\"imichatmsgpreview\"><a class=\"imichatpreview-msg-clearbtn\" id=\"ancclearcards\" onclick=\"parent.clearmsgcards()\" style=\"display:none\">x</a><div id=\"msg-list\"></div>" +
                //"<script>function openchat(threadid){window.parent.postMessage({ action: 'openchat',threadid:threadid}, '*');}</script>" +
                "</html>");
            doc1.close();
            IMIGeneral.storeLocal("style_" + window.location.hostname, msg);


        }
    } catch (e1) { }
}

function chatswitchicon() {
    setappsession();
    var iframe = document.getElementById('imi-chatbutton');
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    //Open Widget
    if (document.getElementById("divchatmain").style.display === 'none') {
        document.getElementById("divchatmain").style.display = "block";
        document.getElementById('chatunread-frame').style.display = "none";
        innerDoc.getElementById("addClass").setAttribute("class", "open-btn state1 " + buttonType + " close-btn");
        document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").style.display = "none";
        document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").innerText = "";
        localStorage.setItem(localStorage.getItem("fingerprint") + "_badgecount", 0);
        localStorage.setItem(localStorage.getItem("fingerprint") + "_cardcount", 0);
        clearmsgcards();
        if (IMIGeneral.getBrowserName() == "safari") {
            if (IMIGeneral.detectIOS() == "yes") {
                document.body.classList.add('chatnoscroll');
            }
        }
        return;
    }
    //Close Widget
    if (document.getElementById("divchatmain").style.display === 'block') {
        //$(document.body).removeClass("chatnoscroll");
        document.body.classList.remove('chatnoscroll');
        document.getElementById("divchatmain").style.display = "none";
        innerDoc.getElementById("addClass").setAttribute("class", "open-btn state " + buttonType);
        document.getElementById('chatunread-frame').style.display = "block";
        localStorage.setItem(localStorage.getItem("fingerprint") + "_cardcount", 0);
        return;
    }
    var iframeEl = document.getElementById("divchataside");
    // Make sure you are sending a string, and to stringify JSON
    iframeEl.contentWindow.postMessage("hello", '*');

}

function setappsession() {
    sessionStorage.setItem("data-bind", document.getElementById("divicw").getAttribute("data-bind"));
    sessionStorage.setItem("data-org", document.getElementById("divicw").getAttribute("data-org"));
}

function clearmsgcards() {
    document.getElementById('chatunread-frame').contentWindow.document.getElementById("msg-list").innerHTML = "";
    document.getElementById('chatunread-frame').contentWindow.document.getElementById("ancclearcards").style.display = "none";
    //document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").style.display = "none";
    //document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").innerText == "";
    localStorage.setItem(localStorage.getItem("fingerprint") + "_cardcount", 0);
}

window.addEventListener('message', function (event) {
    try {
        if (event.data.action != null) {
            if (event.data.action == 'openchat') {
                var destination = document.getElementById('divchataside').contentWindow;
                destination.postMessage({ action: 'openchat', threadid: event.data.threadid }, "*");
                //document.getElementById('chatunread-frame').style.display = "none";
                //document.getElementById("divchatmain").style.display = 'block';
                chatswitchicon();
                //clear batch count;
            }
        }
        else {
            height = event.data['height'];
            if (height == 3) {
                if (document.getElementById("divchatmain").style.display === 'none') {
                    var count = document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").innerText;
                    if (count == 0 || count == "") {
                        count = 1;
                    }
                    else {
                        count = parseInt(count) + 1;
                    }
                    var duplicate = 0;
                    if (count > 1) {
                        var containerDiv = document.getElementById('chatunread-frame').contentWindow.document.getElementById("msg-list");
                        var innerDivs = containerDiv.getElementsByClassName("msg");
                        if (innerDivs != undefined) {
                            for (var i = 0; i < innerDivs.length; i++) {
                                if ("msg_" + event.data['msgtransid'] == innerDivs[i].id) {
                                    duplicate = 1;
                                }
                            }
                        }
                    }
                    var cardcount;
                    var checkbadgecount;
                    if (innerDivs == undefined) {
                        localStorage.setItem(event.data['fingerprint'] + "_cardcount", 1);
                    }
                    document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").style.display = "block";
                    if (duplicate == 0) {
                        if (parseInt(localStorage.getItem(event.data['fingerprint'] + "_cardcount")) <= 5) {
                            cardcount = parseInt(localStorage.getItem(event.data['fingerprint'] + "_cardcount")) + 1;
                            localStorage.setItem(event.data['fingerprint'] + "_cardcount", cardcount);
                            localStorage.setItem("fingerprint", event.data['fingerprint']);
                            var node = document.createElement("div");
                            var node1 = document.createElement("div");
                            var textnode = document.createTextNode(event.data['msg']);
                            if (textnode.data.length > 45) {
                                textnode.data = textnode.data.substr(0, 45) + "...";
                            }
                            node.className = "msg";
                            node.id = "msg_" + event.data['msgtransid'];// Create a text node
                            node1.style = "clear:both";
                            node.addEventListener("click", function () { window.parent.postMessage({ action: 'openchat', threadid: event.data.threadid }, '*'); });
                            node.appendChild(textnode);
                            var height = document.getElementsByClassName('main-unreadchat-cont')[0].style.height;
                            if (cardcount == 2)
                                height = document.getElementsByClassName('main-unreadchat-cont')[0].style.height = 130;
                            else if (cardcount > 2) {
                                document.getElementsByClassName('main-unreadchat-cont')[0].style.height = parseInt(height) + 55;
                            }
                            document.getElementById('chatunread-frame').contentWindow.document.getElementById("msg-list").appendChild(node);
                            document.getElementById('chatunread-frame').contentWindow.document.getElementById("msg-list").appendChild(node1);

                        }
                        localStorage.setItem(event.data['fingerprint'] + "_badgecount", count);
                        document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").innerText = count;

                    }
                    //if (duplicate == 0) {
                    //    localStorage.setItem(event.data['fingerprint'] + "_badgecount", count);
                    //    document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").innerText = count;
                    //}
                    document.getElementById('chatunread-frame').contentWindow.document.getElementById("ancclearcards").style.display = "block";
                    //$("#addClass").find(".badge").text(count);
                }
            }
            else if (height == 2) {
                chatswitchicon();
            }
            else if (height == 1) {
                document.getElementById("divchatmain").classList.add('chatiframeht');
                document.getElementById("addClass").classList.add('close-btn');
            } else {
                document.getElementById("divchatmain").classList.remove('chatiframeht');
                document.getElementById("addClass").classList.remove('close-btn');
                //$(document.body).removeClass("chatnoscroll");
                document.body.classList.add('chatnoscroll');
                document.getElementById("divchatmain").style.display = "none";
            }
        }
    }
    catch (e) { }

    function bindEvent(element, eventName, eventHandler) {
        if (element.addEventListener) {
            element.addEventListener(eventName, eventHandler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, eventHandler);
        }
    }

});
window.addEventListener("resize", function () { var destination = document.getElementById('divchataside').contentWindow; destination.postMessage({ action: 'resize', width: document.body.clientWidth }, "*"); });



