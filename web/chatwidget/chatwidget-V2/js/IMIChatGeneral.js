 
 var IMIGeneral=function()
 {
    
    return{
        domainName:function()
        {
         return "http://widget.imichat.co/chatwidget-V2";
        },
        profileUrl:function()
        {
            return "http://dev.imichat.co/imichatapi/";
        },
        emojiImageURL:function()
        {
            return "http://widget.imichat.co/chatwidget/sheets/sheet_emojione_64_indexed_128.png";
        },
        strReplaceAll:function(string,str_find,str_replace)
        {
            try {
                return string.replace(new RegExp(str_find, "gi"), str_replace);
            } catch (ex) {
                return string;
            }
        },
        ticks:function()
        {
            return new Date().getTime();
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
        clearSession: function () {
            try {
                try {
                    sessionStorage.clear();
                   
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
                
            } catch (e) { }

        },
        getCurrentUTCtime:function()
        {
            var curtime=new Date();
            var utcTime= new Date(
                curtime.getUTCFullYear(),
                curtime.getUTCMonth(),
                curtime.getUTCDate(),
                curtime.getUTCHours(),
                curtime.getUTCMinutes(), 
                curtime.getUTCSeconds()
                );
                return utcTime;
        },
        timeDifference:function(msgTime) {
             msgTime = new Date(msgTime);
             var curtime=new Date();
         var utcTime= new Date(
            curtime.getUTCFullYear(),
            curtime.getUTCMonth(),
            curtime.getUTCDate(),
            curtime.getUTCHours(),
            curtime.getUTCMinutes(), 
            curtime.getUTCSeconds()
            );
            
            var difference = utcTime.getTime() - msgTime.getTime();
    
            var daysDifference = Math.floor(difference/1000/60/60/24);
            difference -= daysDifference*1000*60*60*24;
    
           var hoursDifference = Math.floor(difference/1000/60/60);
            difference -= hoursDifference*1000*60*60;
    
            var minutesDifference = Math.floor(difference/1000/60);
            difference -= minutesDifference*1000*60;
    
            var secondsDifference = Math.floor(difference/1000);
            if(hoursDifference>0)
              return hoursDifference + ' h ago';
            else if(minutesDifference>0)
               return minutesDifference + ' m ago';  
            else if(secondsDifference>0)
               return secondsDifference + ' s ago';  
            //return hoursDifference + ' h ' + minutesDifference + 'm ' + secondsDifference + ' s ago';
          
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
        storeLocal: function (lkey,data) {
            return localStorage.setItem(lkey, JSON.stringify(data));
        },
        getLocal: function (lkey) {
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
                    return false;
                } else if (trident > 0) {
                    // IE 11
                    return true;
                } else if (edge > 0) {
                    // Edge
                    return true;
                } else {
                    // other browser
                    return false;
                }
            } catch (ex) {
                return fasle;
            }
        },
        detectIOS: function () {
            try {
                if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
                    if (!!window.indexedDB) {
                        //return 'iOS 8 and up';
                        return true;
                    }
                    if (!!window.SpeechSynthesisUtterance) {
                        //return 'iOS 7';
                        return true;
                    }
                    if (!!window.webkitAudioContext) {
                        //return 'iOS 6';
                        return true;
                    }
                    if (!!window.matchMedia) {
                        //return 'iOS 5';
                        return true;
                    }
                    if (!!window.history && 'pushState' in window.history) {
                        //return 'iOS 4';
                        return true;
                    }
                    //return 'iOS 3 or earlier';
                    return true;
                }
                //return 'Not an iOS device';
                return true;
            } catch (ex) {
                return true;
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
        getHostName: function () {
            try {
                var a = document.createElement('a');
                a.href = window.document.referrer;
                return a.hostname;
            } catch (e) {
                return window.document.location.hostname;
            }

        },
        rgbToHsl: function (r, g, b) {
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;
    
            if (max == min) {
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
    
            return [h, s, l];
        },
        setEmojiStyle:function(){
        var widgetStyle= this.getLocal("style_" + IMIGeneral.getDomain());
        widgetStyle = $.parseJSON(widgetStyle);
        $(".wdt-emoji-picker .icon-happy").css("color", widgetStyle.widgetcolor);
        }
    };
 }();
 

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
