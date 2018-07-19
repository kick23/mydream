var domainName = "http://widget.imichat.co/chatwidget/";
var CALiveChat = (function () {
    var ws = document.getElementById('txtHdnWorkspaceId').value;

    var LoadAllteams4rSharing = function () {
        $.ajax({
            type: "POST",
            url: $("#baseurl").val() + 'handlers/Users_groupadmin.ashx?ws=' + ws + '&action=webchat_getlcteams4rsharing',
            headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
            data: "",
            async: true,
            success: function (msg) {              
                if (wmsutil.checkSession(msg) == false) {
                    wmsutil.sessionExpired(msg);
                    return;
                }

                if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                    var errormsg = msg.substring(6);
                    UIToastr('error', errormsg);
                    return;
                }
                try {
                    try {
                        debugger;
                        $('#ddlteams').html("");
                        $("#ddlteamlist").html("");
                        var teams = jQuery.parseJSON(msg);
                        TeamList = teams;
                        if (teams != null) {
                            for (var i = 0; i < teams.length; i++) {
                                var newAdminOption = $('<option>');
                                newAdminOption.attr('value', teams[i].chatgrpid).text(teams[i].name);
                                if (teams[i].STATUS == "1") {
                                    newAdminOption.attr('disabled', 'disabled');
                                    newAdminOption.attr('data-status', '1');
                                }
                                else { newAdminOption.attr('data-status', '0'); }
                                $('#ddlteams').append(newAdminOption);

                                var newAdminOption1 = $('<option>');
                                newAdminOption1.attr('value', teams[i].chatgrpid).text(teams[i].name);

                                if (teams[i].STATUS == "1") {
                                    newAdminOption1.attr('disabled', 'disabled');
                                    newAdminOption1.attr('data-status', '1');
                                }
                                else { newAdminOption1.attr('data-status', '0'); }
                                $("#ddlteamlist").append(newAdminOption1);
                            }                             
                          
                            var teamname = $("#ddlteams option:selected").val();
                            $('#ddlteamlist option[value=' + teamname + ']').attr('disabled', 'disabled');
                            rtmdefaultteam = teamname;
                            $("#ddlteamlist").chosen();
                        }
                    } catch (e) {
                        console.log(e.message);
                    }
                }
                catch (ex) { }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (wmsutil.checkSession(thrownError) == false) {
                    wmsutil.sessionExpired(thrownError);
                    return;
                }
                wmsutil.ajaxfyexception();
                try { wmsutil.customloader(0, 1000); } catch (ee) { }
            }
        });
    }

    var CreateLCAssetGenTab = function () {
        try {
            $("#btnsave").prop("disabled", true);
            if ($("#txtorg").val() == "") {
                wmsutil.showerror("Please enter oraganization name");
                return;
            }
            if ($("#txtappname").val() == "") {
                wmsutil.showerror("Please enter app name");
                return;
            }
            if (!ValidateAlphaNumericWithSpace($("#txtorg").val())) {
                wmsutil.showerror("Please enter alphanumeric values");
                return;
            }
            if (!ValidateAlphaNumericWithSpace($("#txtappname").val())) {
                wmsutil.showerror("Please enter alphanumeric values");
                return;
            }
            if ($("#ddlteams").val() == undefined || $("#ddlteams").val() == null || $("#ddlteams").val() == "") {
                wmsutil.showerror("Please select default team");
                return;
            }
            if ($("#ddlteams").val() != "") {
                var selTeams = $("#ddlteamlist").val();
                if (selTeams != null && selTeams.length > 0) {
                    if (selTeams.indexOf($("#ddlteams").val()) > -1) {
                        wmsutil.showerror("Already team (" + $("#ddlteams :selected").text() + ") is selected in 'Default Team'.");
                        return;
                    }
                }
            }
            var teamlist = "";
            if ($("#ddlteamlist").val() != undefined) {
                teamlist = $("#ddlteamlist").val().join();
            }
            try { wmsutil.customloader(1, 0); } catch (ee) { }
            var postdata = { "organization": $("#txtorg").val(), "appname": $("#txtappname").val().trim(), "assetlevel": "1", "teamlist": teamlist, "defaultteam": $("#ddlteams").val(), "showprevhist": $("#chkhistory").is(":checked") };
            $("#btnsave").prop("disabled", true);
            $.ajax({
                type: "POST",
                headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
                url: $("#baseurl").val() + 'Handlers/Users_groupadmin.ashx?ws=' + ws + '&action=webchat_createcalcasset',
                data: postdata,
                async: true,
                success: function (msg) {
                    $("#btnsave").prop("disabled", false);
                    try { wmsutil.customloader(0, 0); } catch (ee) { }
                    if (wmsutil.checkSession(msg) == false) {
                        wmsutil.sessionExpired(msg);
                        return;
                    }
                    if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                        var errormsg = msg.substring(6);
                        var emsg = msg.split('|')
                        try {

                            if (emsg.length >= 2) {
                                if (emsg.indexOf(',') > -1) {
                                    var teamlist = emsg[2].split(',');
                                    var tnames = "";
                                    for (i = 0; i < teamlist.length; i++) {
                                        tnames += $("#ddlteams option[value='" + teamlist[i] + "']").text() + ",";
                                    }
                                    if (tnames != "")
                                        UIToastr('error', "Failed to create WebChat Assets for team " + tnames.replace(/,$/, ''));
                                    else
                                        UIToastr('error', errormsg);
                                } else {
                                    UIToastr('error', emsg[1]);
                                    return;
                                }
                            } else {
                                UIToastr('error', errormsg);
                            }
                        }
                        catch (e1) { }
                        //$("#txtorg").val("");
                        //$("#txtappname").val("");
                        return;
                    }
                    if (msg.indexOf('success') >= 0 || msg.indexOf('SUCCESS') >= 0) {
                        UIToastr('success', "App Created Successfully.");
                        $("#2").removeClass('disabled');
                        sessionStorage.setItem("LCRTMID", msg.split('|')[2]);
                    }
                },
                error: function (xhr, err, thrownError) {
                    $("#btnsave").prop("disabled", false);
                    $("#myappmodal").modal('hide');
                    if (wmsutil.checkSession(thrownError) == false) {
                        wmsutil.sessionExpired(thrownError);
                        return;
                    }
                    wmsutil.ajaxfyexception();
                    try {
                        wmsutil.customloader(0, 1000);
                    } catch (ee) { }
                    console.log("error:" + err);
                    UIToastr('error', "Error in proccessing the request");
                }
            });
        }
        catch (e) {
            console.log("exception:" + e.message);
        }
    }

    var UpdateLCAssetGenTab = function (rtmid) {
        try {
            $("#btnsave").prop("disabled", true);

            if ($("#ddlteams").val() == undefined || $("#ddlteams").val() == null || $("#ddlteams").val() == "") {
                wmsutil.showerror("Please select default team");
                return;
            }
            if ($("#ddlteams").val() != "") {
                var selTeams = $("#ddlteamlist").val();
                if (selTeams != null && selTeams.length > 0) {
                    if (selTeams.indexOf($("#ddlteams").val()) > -1) {
                        wmsutil.showerror("Already team (" + $("#ddlteams :selected").text() + ") is selected in 'Default Team'.");
                        return;
                    }
                }
            }
            var teamlist = "";
            if ($("#ddlteamlist").val() != undefined) {
                teamlist = $("#ddlteamlist").val().join();
            }
            try { wmsutil.customloader(1, 0); } catch (ee) { }
            var postdata = { "assetlevel": "1", "teamlist": teamlist, "defaultteam": $("#ddlteams").val(), "showprevhist": $("#chkhistory").is(":checked"), "rtmid": rtmid };

            $.ajax({
                type: "POST",
                headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
                url: $("#baseurl").val() + 'Handlers/Users_groupadmin.ashx?ws=' + ws + '&action=webchat_updatecalcassetgentab',
                data: postdata,
                async: true,
                success: function (msg) {
                    debugger;
                    $("#btnsave").prop("disabled", false);
                    try { wmsutil.customloader(0, 0); } catch (ee) { }
                    if (wmsutil.checkSession(msg) == false) {
                        wmsutil.sessionExpired(msg);
                        return;
                    }
                    if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                        var errormsg = msg.substring(6);
                        var emsg = msg.split('|')
                        try {

                            if (emsg.length >= 2) {
                                if (emsg.indexOf(',') > -1) {
                                    var teamlist = emsg[2].split(',');
                                    var tnames = "";
                                    for (i = 0; i < teamlist.length; i++) {
                                        tnames += $("#ddlteams option[value='" + teamlist[i] + "']").text() + ",";
                                    }
                                    if (tnames != "")
                                        UIToastr('error', "Failed to update WebChat Assets for team " + tnames.replace(/,$/, ''));
                                    else
                                        UIToastr('error', errormsg);
                                } else {
                                    UIToastr('error', emsg[1]);
                                    return;
                                }
                            } else {
                                UIToastr('error', errormsg);
                            }
                        }
                        catch (e1) { }
                        //$("#txtorg").val("");
                        //$("#txtappname").val("");
                        return;
                    }
                    if (msg.indexOf('success') >= 0 || msg.indexOf('SUCCESS') >= 0) {
                        UIToastr('success', "LiveChat settings updated Successfully.");
                       // sessionStorage.setItem("LCRTMID", msg.split('|')[1]);
                    }
                },
                error: function (xhr, err, thrownError) {
                    $("#btnsave").prop("disabled", false);
                    $("#myappmodal").modal('hide');
                    if (wmsutil.checkSession(thrownError) == false) {
                        wmsutil.sessionExpired(thrownError);
                        return;
                    }
                    wmsutil.ajaxfyexception();
                    try {
                        wmsutil.customloader(0, 1000);
                    } catch (ee) { }
                    console.log("error:" + err);
                    UIToastr('error', "Error in proccessing the request");
                }
            });
        }
        catch (e) {
            $("#btnsave").prop("disabled", false);
            console.log("exception:" + e.message);
        }
    }

    var GetLCWidgetData = function (rtmid) {
        $(".clientwebchat").html("");
        $.ajax({
            type: "POST",
            url: $("#baseurl").val() + 'handlers/Users_groupadmin.ashx?ws=' + ws + '&action=webchat_getlcwidgetdata&rtmid=' + rtmid,
            headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
            data: "",
            async: true,
            success: function (msg) {
                if (wmsutil.checkSession(msg) == false) {
                    wmsutil.sessionExpired(msg);
                    return;
                }
                if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                    var errormsg = msg.substring(6);
                    UIToastr('error', errormsg);
                    return;
                }
                try {
                    debugger;
                    if (msg != null) {
                        var jsonInfo = jQuery.parseJSON(msg);
                        if (msg.length > 0) {
                            $("#2").removeClass('disabled');
                            try {
                                if (jsonInfo.Table != null && jsonInfo.Table.length > 0) {
                                    $("#txtorg").val(jsonInfo.Table[0].ORAGANIZATION).prop('readonly', true);
                                    $("#txtappname").val(jsonInfo.Table[0].APPNAME).prop('readonly', true);
                                    if (jsonInfo.Table[0].SHOWPREVHIST == 1) {
                                        $("#chkhistory").attr("checked", "checked");
                                    } else {
                                        $("#chkhistory").prop("checked", false);
                                    }
                                    $("#ddlteams").val(jsonInfo.Table[0].TEAMID);
                                    $('#ddlteams option[value=' + jsonInfo.Table[0].TEAMID + ']').attr('disabled', false);
                                    $('#ddlteamlist option[value=' + jsonInfo.Table[0].TEAMID + ']').attr('disabled', false);
                                    var bindinfo = "<div id=\"divicw\" data-bind=\"#TAPPID#\" data-org=\"#ORG#\"></div>";
                                    bindinfo += "<script src=\"" + domainName + "js/imichatinit.js\"></script>";
                                    bindinfo = bindinfo.replace("#TAPPID#", jsonInfo.Table[0].TEAMAPPID);
                                    bindinfo = bindinfo.replace("#ORG#", jsonInfo.Table[0].ORAGANIZATION);
                                    $("#divwccode").val(bindinfo);
                                }
                            } catch (e) { }
                            try {
                                if (jsonInfo.Table2.length > 0) {
                                    $.each(jsonInfo.Table2, function (idx, obj) {
                                        if (obj.STATUS == "1") {
                                            if (obj.ISDEFAULT == "1") {
                                                $('#ddlteams option[value=' + obj.TEAMID + ']').attr('disabled', false);
                                                $('#ddlteamlist option[value=' + obj.TEAMID + ']').attr('disabled', 'disabled');
                                            } else {
                                                $('#ddlteams option[value=' + obj.TEAMID + ']').attr('disabled', false);
                                                $('#ddlteamlist option[value=' + obj.TEAMID + ']').attr('disabled', false);
                                                $('#ddlteamlist option[value=' + obj.TEAMID + ']').attr('selected', true);
                                            }
                                        }
                                    });
                                    $("#ddlteamlist").trigger("chosen:updated");
                                }
                            } catch (e) { }
                            try {
                                if (jsonInfo.Table1.length > 0) {
                                    var html = '';
                                    $(".clientwebchat").html("");
                                    $("#0,#2").removeClass('disabled');
                                    for (var i = 0; i < jsonInfo.Table1.length; i++) {
                                        html += GetWebsiteStyles(jsonInfo.Table1[i].logo_path, jsonInfo.Table1[i].name, jsonInfo.Table1[i].host, jsonInfo.Table1[i].widgetcolor, jsonInfo.Table1[i].isemojienable, jsonInfo.Table1[i].ispresurveyenabled, 0, jsonInfo.Table1[i].website_id);
                                    }
                                    $(".clientwebchat").html(html);
                                } else {
                                    $("#0").addClass('disabled');
                                    $(".clientwebchat").html('<div id="emptychatarea" style="padding: 10%;"><img src="imichat/images/world-wide-web.svg" alt="No conversation to display"><br><span class="emptyheader">No website Created</span><span class="emptytxt">Create a website asset by clicking on "ADD WEBSITE" button.</span></div>');
                                }
                            } catch (e) { }
                        }
                    }
                }
                catch (ex) { }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (wmsutil.checkSession(thrownError) == false) {
                    wmsutil.sessionExpired(thrownError);
                    return;
                }
                wmsutil.ajaxfyexception();
                try { wmsutil.customloader(0, 1000); } catch (ee) { }
            }
        });
    }
    var GetWebsiteStyles = function (logopath, websitename, websiteurl, widgetcolor, isemojienabled, ispresurveyenabled, ispostsurveyenabled, websiteid) {
        if (logopath == null || logopath == "") { logopath = "imichat/images/default-website.png"; }
        return html = '<div class="card">' +
     '<div class="card-inner">' +
     '<img onerror=this.src="imichat/images/default-website.png" class="webchatclient-img" src="' + logopath + '">' +
     '<div class="webchatclient-namecont">' +
     '<label class="webchatclient-name">' + websitename + '</label>' +
     '<div class="webchatclient-website"><a onclick="window.open(\'http://' + websiteurl + '\');" ><i class="fa fa-globe"></i><span>' + websiteurl + '</span></a></div>' +
     '</div>' +
     '<div class="clearfix"></div>' +
     '<div class="webchatclient-infocont">' +
     '<div class="webchatclient-info color"><span class="color" style="background-color:' + widgetcolor + '!important"></span><span>' + widgetcolor + '</span></div> ' +
    // '<div class="webchatclient-info attachment disable"><span class="icon-attach"></span><span>Enabled</span></div>' +
     (isemojienabled == 1 ? '<div class="webchatclient-info emoji isemojienabled"><span class="icon-emoji"></span><span>Enabled</span></div> '
     : '<div class="webchatclient-info emoji disable isemojienabled"><span class="icon-emoji"></span><span>Enabled</span></div> ') +
     '</div>' +
    (ispresurveyenabled == 1 ? '<p class="webchatclient-infoline ispresurveyenabled"><i class="fa fa-check"></i> Custom Pre-chat Form</p>'
    : '<p class="webchatclient-infoline disable ispresurveyenabled"><i class="fa fa-close"></i> Custom Pre-chat Form</p>') +

    //(ispostsurveyenabled == 1 ? '<p class="webchatclient-infoline "><i class="fa fa-check"></i> Post chat Survey</p>'
    //: '<p class="webchatclient-infoline disable"><i class="fa fa-close"></i> Post chat Survey</p>') +


     '<div class="clearfix"></div>' +
     '<div class="webchatclient-btncont">' +
     '<a class="webchatclient-btn" onClick="CALiveChat.EditLCWebsite(' + websiteid + ');"><i class="fa fa-pencil edit"></i> Edit</a>' +
     '<a class="webchatclient-btn" onClick="CALiveChat.CloneLCWebsite(' + websiteid + ');"><i class="fa fa-clone clone"></i> Clone</a>' +
     '<a class="webchatclient-btn" onClick="CALiveChat.DeleteLCWebsite(' + websiteid + ');"><i class="fa fa-trash delete"></i> Delete</a>' +
     '</div>' +
     '</div>' +
     '</div>'
    }
    var EditLCWebsite = function (wid) {
        if (sessionStorage.getItem("LCRTMID") == undefined || sessionStorage.getItem("LCRTMID") == null || sessionStorage.getItem("LCRTMID") == "") {
            UIToastr('error', "something went wrong please refresh the page and tryagain...");
            return;
        }
        sessionStorage.setItem("LCISEDIT", 1);
        sessionStorage.setItem("LCWSID", wid);
        LoadAjaxifyUrl("clientassetwebchatsitedetail");
    }
    var AddLCWebsite = function (wid) {
        if (sessionStorage.getItem("LCRTMID") == undefined || sessionStorage.getItem("LCRTMID") == null || sessionStorage.getItem("LCRTMID") == "") {
            UIToastr('error', "something went wrong please refresh the page and tryagain...");
            return;
        }
        sessionStorage.setItem("LCISEDIT", 0);
        sessionStorage.removeItem("LCWSID");
        LoadAjaxifyUrl("clientassetwebchatsitedetail");
    }
    var CloneLCWebsite = function (wid) {
        if (sessionStorage.getItem("LCRTMID") == undefined || sessionStorage.getItem("LCRTMID") == null || sessionStorage.getItem("LCRTMID") == "") {
            UIToastr('error', "something went wrong please refresh the page and tryagain...");
            return;
        }
        $.ajax({
            type: "POST",
            url: $("#baseurl").val() + 'handlers/Users_groupadmin.ashx?ws=' + ws + '&action=webchat_clonelcwebsite&wid=' + wid + "&rtmid=" + sessionStorage.getItem("LCRTMID"),
            headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
            data: "",
            async: true,
            success: function (msg) {
                if (wmsutil.checkSession(msg) == false) {
                    wmsutil.sessionExpired(msg);
                    return;
                }
                if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                    var errormsg = msg.substring(6);
                    UIToastr('error', "something went wrong please refresh the page and try again...");
                    return;
                }
                try {
                    if (msg.indexOf('success') >= 0 || msg.indexOf('SUCCESS') >= 0) {
                        var errormsg = msg.substring(8).split('|');
                        if (errormsg[0] == "0") {
                            UIToastr('success', "website cloned successfully.");
                            if (sessionStorage.getItem("LCRTMID") != undefined && sessionStorage.getItem("LCRTMID") != null && sessionStorage.getItem("LCRTMID") != "") {
                                GetLCWidgetData(sessionStorage.getItem("LCRTMID"));
                                $('#tmplChannels a[href="#form"]').tab('show');
                                sessionStorage.setItem("LCISEDIT", 1);
                                sessionStorage.setItem("LCWSID", errormsg[1]);
                                LoadAjaxifyUrl("clientassetwebchatsitedetail");
                            }
                            return;
                        }
                    }
                }
                catch (ex) {
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (wmsutil.checkSession(thrownError) == false) {
                    wmsutil.sessionExpired(thrownError);
                    return;
                }
                wmsutil.ajaxfyexception();
                try { wmsutil.customloader(0, 1000); } catch (ee) { }
            }
        });
    }
    var DeleteLCAWebsite = function (wid) {
        debugger;
        if (sessionStorage.getItem("LCRTMID") == undefined || sessionStorage.getItem("LCRTMID") == null || sessionStorage.getItem("LCRTMID") == "") {
            UIToastr('error', "something went wrong please refresh the page and tryagain...");
            return;
        }
        $.ajax({
            type: "POST",
            url: $("#baseurl").val() + 'handlers/Users_groupadmin.ashx?ws=' + ws + '&action=webchat_deletelcwebsite&wid=' + wid + "&rtmid=" + sessionStorage.getItem("LCRTMID"),
            headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
            data: "",
            async: true,
            success: function (msg) {
                if (wmsutil.checkSession(msg) == false) {
                    wmsutil.sessionExpired(msg);
                    return;
                }

                if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                    var errormsg = msg.substring(6);
                    UIToastr('error', "something went wrong please refresh the page and try again...");
                    return;
                }
                try {
                    if (msg.indexOf('success') >= 0 || msg.indexOf('SUCCESS') >= 0) {
                        var errormsg = msg.substring(8);
                        if (errormsg == "0") {
                            UIToastr('success', "website successfully deleted.");
                            if (sessionStorage.getItem("LCRTMID") != undefined && sessionStorage.getItem("LCRTMID") != null && sessionStorage.getItem("LCRTMID") != "") {
                                GetLCWidgetData(sessionStorage.getItem("LCRTMID"));
                                $('#tmplChannels a[href="#form"]').tab('show');
                            }
                            return;
                        }
                    }
                }
                catch (ex) {
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (wmsutil.checkSession(thrownError) == false) {
                    wmsutil.sessionExpired(thrownError);
                    return;
                }
                wmsutil.ajaxfyexception();
                try { wmsutil.customloader(0, 1000); } catch (ee) { }
            }
        });
    }
    return {
        init: function () {
            $("#0,#2").addClass('disabled');
            try {
                AssignKeyupEvents();
                $("#tmplChannels a[data-toggle=tab]").on("click", function (e) {
                    if ($(this).parent('li').hasClass("disabled")) {
                        e.preventDefault();
                        return false;
                    }
                });
            } catch (e) { }
            LoadAllteams4rSharing();
            $(".clientwebchat").html("");
            try {
                if (sessionStorage.getItem("LCRTMID") != undefined && sessionStorage.getItem("LCRTMID") != null && sessionStorage.getItem("LCRTMID") != "") {
                    GetLCWidgetData(sessionStorage.getItem("LCRTMID"));
                    sessionStorage.removeItem("LCWSID");
                    if (sessionStorage.getItem("LCISEDIT") == 1)
                        $('#tmplChannels a[href="#form"]').tab('show');
                }
            } catch (e) { }
            try {
                setTimeout(function () {
                    var teamname = $("#ddlteams option:selected").val();
                    $('#ddlteamlist option[value=' + teamname + ']').attr('disabled', 'disabled');
                    rtmdefaultteam = teamname;
                }, 3500);
                $("#ddlteams").change(function () {
                    debugger;
                    try {
                        var teamname = $("#ddlteams option:selected").val();
                        $('#ddlteamlist option[value=' + teamname + ']').attr('disabled', 'disabled');
                        if (rtmdefaultteam != "" && rtmdefaultteam != undefined && rtmdefaultteam != null) {
                            $('#ddlteamlist option[value=' + rtmdefaultteam + ']').attr('disabled', false);
                            rtmdefaultteam = teamname;
                        }
                        $(".chosen-select").val('').trigger("chosen:updated");
                    } catch (e) { }
                });
            } catch (X) { }
        },
        CreateLCAsset: function () {
            debugger;
            if (sessionStorage.getItem("LCRTMID") != undefined && sessionStorage.getItem("LCRTMID") != null && sessionStorage.getItem("LCRTMID") != "") {
                UpdateLCAssetGenTab(sessionStorage.getItem("LCRTMID"));
            } else {
                CreateLCAssetGenTab();
            }
        },
        LoadAssetRelatedWebsites: function (rtmid) {
            GetLCWidgetData(rtmid);
        },
        AddLCWebsite: function (wid) {
            AddLCWebsite(wid);
        },
        EditLCWebsite: function (wid) {
            EditLCWebsite(wid);
        },
        CloneLCWebsite: function (wid) {
            CloneLCWebsite(wid);
        },
        DeleteLCWebsite: function (wid) {
            $("#modalPopupCommon #modalPopupCommonLabel").html("Confirm");
            // $("#modalPopupCommon #modalPopupCommonBody").html("<p>Are you sure you want to delete this template?<br/>Once Deleted you cannot create with same name again.</p>");
            $("#modalPopupCommon #modalPopupCommonBody").html("<p>Deleting of a website is an irrevocable action. Are you sure you want to delete this website?.</p>");
            $("#modalPopupCommon #btnPopupCommonClose").text("CANCEL");
            $("#btnPopupCommonSubmit").text("DELETE");
            $("#btnPopupCommonSubmit").attr("onclick", "CALiveChat.DeleteLCAWebsite(" + wid + ");$('#modalPopupCommon').modal('hide');");
            $("#btnPopupCommonSubmit").removeClass("processing");
            $("#btnPopupCommonClose").text("CANCEL");
            $("#modalPopupCommon").modal('show');            
        },
        DeleteLCAWebsite: function (wid) {
            DeleteLCAWebsite(wid);
        }
    };
})();
var rtmdefaultteam = '';
$(function () {
    sessionStorage.removeItem("LCWSID");
    AssignKeyupEvents();
    CALiveChat.init();
});

