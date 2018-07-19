<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="IMIchatAPI.Swagger.Index" %>

<!DOCTYPE html>
<html>
<head>
    <style>
        .no-js #loader { display: none;  }
        .js #loader { display: block; position: absolute; left: 100px; top: 0; }
        .se-pre-con {
	        position: fixed;
	        left: 0px;
	        top: 0px;
	        width: 100%;
	        height: 100%;
	        z-index: 9999;
	        background: url(<%=ResolveUrl("~/")%>swagger/images/loader-64x/Preloader_1.gif) center no-repeat;
        }
    </style>
    <title>IMIchat API Explorer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="<%=ResolveUrl("~/")%>swagger/css/index.css" rel="stylesheet" />
    <link href="<%=ResolveUrl("~/")%>swagger/css/standalone.css" rel='stylesheet' />
    <link href="<%=ResolveUrl("~/")%>swagger/css/api-explorer.css" rel='stylesheet' type='text/css' />
    <link href="<%=ResolveUrl("~/")%>swagger/css/screen.css" media='screen' rel='stylesheet' type='text/css' />
    <script src="<%=ResolveUrl("~/")%>swagger/lib/jquery-1.8.0.min.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/lib/jquery.slideto.min.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/lib/jquery.wiggle.min.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/lib/jquery.ba-bbq.min.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/lib/handlebars-2.0.0.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/lib/underscore-min.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/lib/backbone-min.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/swagger-ui.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/lib/jsoneditor.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/lib/highlight.7.3.pack.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/lib/marked.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/lib/swagger-oauth.js" type='text/javascript'></script>
    <script src="<%=ResolveUrl("~/")%>swagger/lib/bootstrap.min.js" type='text/javascript'></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.2/modernizr.js"></script>
    <script type="text/javascript">
        var qs = (function (a) {
            if (a == "") return {};
            var b = {};
            for (var i = 0; i < a.length; ++i) {
                var p = a[i].split('=', 2);
                if (p.length == 1)
                    b[p[0]] = "";
                else
                    b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
            return b;
        })(window.location.search.substr(1).split('&'));
        var Base64 = {
            // private property
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

            // public method for encoding
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = Base64._utf8_encode(input);

                while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                    Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                    Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

                }

                return output;
            },

            // public method for decoding
            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                while (i < input.length) {

                    enc1 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc2 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc3 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc4 = Base64._keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                }

                output = Base64._utf8_decode(output);

                return output;

            },

            // private method for UTF-8 encoding
            _utf8_encode: function (string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            },

            // private method for UTF-8 decoding
            _utf8_decode: function (utftext) {
                var string = "";
                var i = 0;
                var c = c1 = c2 = 0;

                while (i < utftext.length) {

                    c = utftext.charCodeAt(i);

                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    }
                    else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    }
                    else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }

                }
                return string;
            }
        }

        jQuery.browser = jQuery.browser || {};
        (function () {
            jQuery.browser.msie = jQuery.browser.msie || false;
            jQuery.browser.version = jQuery.browser.version || 0;
            if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
                jQuery.browser.msie = true;
                jQuery.browser.version = RegExp.$1;
            }
        })();
    </script>
    <script type="text/javascript">
        var rootUrl = "<%=ResolveUrl("~/")%>";
        var versionSelectBox =
            "<div class=\"form-group\">" +
                "<label for=\"ddlVersion\">API Version:</label>" +
                "<select class=\"ui-form-control\" id=\"ddlVersion\" onchange=\"LoadSwaggerVersion();\">" +
                  "<option value=\"0.0\">legacy api</option>" +
                  "<option value=\"1.0\">v1.0</option>" +
                  "<option value=\"2.0\" selected=\"selected\">v2.0</option>" +
                "</select>" +
            "</div>";
        function LoadSwaggerVersion() {
            var selectedOption = $("#ddlVersion option:selected");
            window.location.href = rootUrl + "?version=" + selectedOption.val();
        }

        function SetAccessToken(event) {
            var base64AuthCode = Base64.encode($("#token-input").val())
            $.ajax({
                type: "GET",
                headers: {
                    'auth_code': base64AuthCode
                },
                url: rootUrl + "authorize",
                async: true,
                dataType: "json",
            }).done(function (data, textStatus, xhr) {
                if (xhr.getResponseHeader('access_token') !== null) {
                    $('#api-token-error').hide();
                    sessionStorage.setItem('access_token', xhr.getResponseHeader('access_token'));
                    $('#api-token-modal').modal('hide');
                    $('#btnSetApiToken').html('Re-Authenticate');
                }
                else {
                    sessionStorage.clear();
                    $('#api-token-error').text(data.description);
                    $('#api-token-error').show();
                    $('#btnSetApiToken').html('Authenticate');
                }
            }).fail(function (data, textStatus, xhr) {
                sessionStorage.clear();
                $('#api-token-error').text("Your authentication code is not valid. Please double-check the values you have entered and try again.");
                $('#api-token-error').show();
                $('#btnSetApiToken').html('Authenticate');
            });
            return;
        }
        $("#api-token-modal").on("hidden.bs.modal", function () {
            $('#token-input').val('');
            $('#api-token-error').hide();
        });
        $('#api-token-modal').on('hidden.bs.modal', function (e) {
            $('#token-input').val('');
            $('#api-token-error').hide();
        })
        $(function () {

            /*Refresh common message*/
            /*$.get(rootUrl + "refresh", function (data) {
                console.log("Common message cache refreshed.")
            });*/

            function arrayFrom(configString) {
                return (configString !== "") ? configString.split('|') : [];
            }

            function stringOrNullFrom(configString) {
                return (configString !== "null") ? configString : null;
            }

            var version = qs["version"];
            var swaggerDocURL = "v2.0/docs";
            if (version !== undefined) {
                swaggerDocURL = "v" + version + "/docs"
            }
            console.log(version);
            window.swashbuckleConfig = {
                rootUrl: rootUrl,
                discoveryPaths: arrayFrom(swaggerDocURL),
                booleanValues: arrayFrom('true|false'),
                validatorUrl: stringOrNullFrom(''),
                customScripts: arrayFrom(''),
                docExpansion: 'none',
                supportedSubmitMethods: arrayFrom('get|put|post|delete|options|head|patch'),
                oAuth2Enabled: ('false' === 'true'),
                oAuth2ClientId: '',
                oAuth2ClientSecret: '',
                oAuth2Realm: '',
                oAuth2AppName: '',
                oAuth2ScopeSeperator: ' ',
                oAuth2AdditionalQueryStringParams: JSON.parse('{}'),
                apiKeyName: 'api_key',
                apiKeyIn: 'query'
            };

            window.swaggerUi = new SwaggerUi({
                url: swashbuckleConfig.rootUrl + "/" + swashbuckleConfig.discoveryPaths[0],
                dom_id: "swagger-ui-container",
                booleanValues: swashbuckleConfig.booleanValues,
                supportedSubmitMethods: swashbuckleConfig.supportedSubmitMethods,
                onComplete: function (swaggerApi, swaggerUi) {
                    if (sessionStorage.getItem('access_token') != null) {
                        $('#btnSetApiToken').html('Re-Authenticate');
                    }
                    if (typeof initOAuth == "function" && swashbuckleConfig.oAuth2Enabled) {
                        initOAuth({
                            clientId: swashbuckleConfig.oAuth2ClientId,
                            clientSecret: swashbuckleConfig.oAuth2ClientSecret,
                            realm: swashbuckleConfig.oAuth2Realm,
                            appName: swashbuckleConfig.oAuth2AppName,
                            scopeSeparator: swashbuckleConfig.oAuth2ScopeSeperator,
                            additionalQueryStringParams: swashbuckleConfig.oAuth2AdditionalQueryStringParams
                        });
                    }

                    if (window.SwaggerTranslator) {
                        window.SwaggerTranslator.translate();
                    }

                    addApiKeyAuthorization();

                    window.swaggerApi = swaggerApi;
                    _.each(swashbuckleConfig.customScripts, function (script) {
                        $.getScript(script);
                    });

                    $('pre code').each(function (i, e) {
                        hljs.highlightBlock(e);
                    });

                    $("[data-toggle='tooltip']").tooltip();

                    addApiKeyAuthorization();
                    if (version !== undefined) {
                        document.getElementById("ddlVersion").value = version;
                    }
                    $("div[data-label='version']").parent().remove();
                    $(document).find("option[value='text/json']").remove();
                    $(document).find("option[value='text/xml']").remove();
                    $(".se-pre-con").fadeOut("slow");
                },
                onFailure: function (data) {
                    log("Unable to Load SwaggerUI");
                },
                docExpansion: swashbuckleConfig.docExpansion,
                jsonEditor: false,
                apisSorter: "alpha",
                operationsSorter: function (a, b) {
                    var order = { 'get': '0', 'post': '1', 'put': '2', 'patch': '3', 'delete': '4' };
                    return order[a.method].localeCompare(order[b.method]);
                },
                defaultModelRendering: 'schema',
                showRequestHeaders: true,
                oauth2RedirectUrl: window.location.href.replace('index', 'o2c-html').split('#')[0]
            });

            function addApiKeyAuthorization() {
                var key = $('#input_apiKey')[0].value;
                if (key && key.trim() != "") {
                    if (swashbuckleConfig.apiKeyIn === "query") {
                        key = encodeURIComponent(key);
                    }
                    var apiKeyAuth = new SwaggerClient.ApiKeyAuthorization(swashbuckleConfig.apiKeyName, key, swashbuckleConfig.apiKeyIn);
                    window.swaggerUi.api.clientAuthorizations.add("api_key", apiKeyAuth);
                    log("added key " + key);
                }
            }
            $('#input_apiKey').change(addApiKeyAuthorization);

            window.swaggerUi.load();

            function log() {
                if ('console' in window) {
                    console.log.apply(console, arguments);
                }
            }
        });
    </script>

    <script type="text/javascript">

        $(function () {
            $(window).scroll(function () {
                var sticky = $(".sticky-nav");

                i(sticky);
                r(sticky);

                function n() {
                    return window.matchMedia("(min-width: 992px)").matches
                }

                function e() {
                    n()
                        ? sticky.parents(".sticky-nav-placeholder").removeAttr("style")
                        : sticky.parents(".sticky-nav-placeholder").css("min-height", sticky.outerHeight());
                }

                function i(n) {
                    n.hasClass("fixed") || (navOffset = n.offset().top);
                    e();
                    $(window).scrollTop() > navOffset
                        ? $(".modal.in").length || n.addClass("fixed")
                        : n.removeClass("fixed");
                }

                function r(e) {
                    function i() {
                        var i = $(window).scrollTop(), r = e.parents(".sticky-nav");
                        return r.hasClass("fixed") && !n() && (i = i + r.outerHeight() + 40), i;
                    }

                    function r(e) {
                        var t = o.next("[data-endpoint]"), n = o.prev("[data-endpoint]");
                        return "next" === e
                            ? t.length
                            ? t
                            : o.parent().next().find("[data-endpoint]").first()
                            : "prev" === e
                            ? n.length
                            ? n
                            : o.parent().prev().find("[data-endpoint]").last()
                            : [];
                    }

                    var nav = e.find("[data-navigator]");
                    if (nav.find("[data-endpoint][data-selected]").length) {
                        var o = nav.find("[data-endpoint][data-selected]"),
                            a = $("#" + o.attr("data-endpoint")),
                            s = a.offset().top,
                            l = (s + a.outerHeight(), r("next")),
                            u = r("prev");
                        if (l.length) {
                            {
                                var d = $("#" + l.attr("data-endpoint")), f = d.offset().top;
                                f + d.outerHeight()
                            }
                            i() >= f && c(l);
                        }
                        if (u.length) {
                            var p = $("#" + u.attr("data-endpoint")),
                            g = u.offset().top;
                            v = (g + p.outerHeight(), 100);
                            i() < s - v && c(u);
                        }
                    }
                }

                function s() {
                    var e = $(".sticky-nav [data-navigator]"),
                        n = e.find("[data-endpoint]").first();
                    n.attr("data-selected", "");
                    u.find("[data-selected-value]").html(n.text());
                }

                function c(e) {
                    {
                        var n = $(".sticky-nav [data-navigator]");
                        $("#" + e.attr("data-endpoint"))
                    }
                    n.find("[data-resource]").removeClass("active");
                    n.find("[data-selected]").removeAttr("data-selected");
                    e.closest("[data-resource]").addClass("active");
                    e.attr("data-selected", "");
                    sticky.find("[data-selected-value]").html(e.text());
                }
            });

        });
    </script>
    <script type="text/javascript">
        $(function () {
            $("[data-toggle='tooltip']").tooltip();
        });
    </script>
</head>
<body class="page-docs" style="zoom: 1;">
    <div class="se-pre-con"></div>
    <form id="form2" runat="server">
        <header class="site-header" style="background-color: ButtonHighlight">
            <nav role="navigation" class="navbar navbar-default">
                <div class="container">
                    <div class="navbar-header">
                        <h1 class="navbar-brand"><a href="#"></a></h1>
                    </div>
                    <div class="navbar-header">
                        <h4>API Explorer</h4>
                    </div>
                </div>
            </nav>
        </header>

        <section class="content">
            <div id="api2-explorer">
                <div class="swagger-section page-docs" style="zoom: 1">
                    <div class="main-section">
                        <div id="swagger-ui-container" class="swagger-ui-wrap">
                        </div>
                        <input id="hdnAccessToken" type="hidden" />
                        <div class="modal" id="api-token-modal" style="display: none;">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header has-border">
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                        <h4 id="api-token-modal-title" class="modal-title">Set Authentication Code</h4>
                                    </div>
                                    <div class="modal-body">
                                        <div id="api-token-error" class="alert alert-danger" style="display: none;">
                                            Your authentication code is not valid. Please double-check the values you have entered and try again.
                                        </div>
                                        <div class="row form-group">
                                            <label class="control-label col-xs-4" for="token-input">Authentication Code</label>
                                            <div class="col-xs-10">
                                                <input type="text" autocomplete="off" class="ui-form-control" id="token-input" name="token" required="" placeholder="Enter authentication code(Format example: key@domainname).">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <a href="#" class="btn btn-primary" id="btnAuthorize" onclick="SetAccessToken();">Authenticate</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </form>
</body>
</html>