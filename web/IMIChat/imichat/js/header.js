
var formId = "";
$(document).ready(function () {
    formId = $('form').attr('id');
    GetAgentCustomStatuses();
    CallHandler_Header("headerinfo", "identity_headerinfo", "");
});

function CallHandler_Header(method, actionType, postData) {
    var ws = document.getElementById('txtHdnWorkspaceId').value;
    $.ajax({
        type: "POST",
        url: $("#baseurl").val() + 'handlers/Users_AgentAdmin.ashx?ws=' + ws + '&action=' + actionType,
        headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': GetGUID() },
        data: postData,
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
                switch (method) {
                    case "headerinfo":
                        {
                            BindTeams(msg);
                            //$("span.ddicon").each(function () {
                            //    $(this).css("background-color", get_random_color());
                            //});
                        }
                        break;
                    case "chatsmode":
                        {
                            $("#hdnagentchatstatus").val($("#teamagentstatus option:selected").text());
                            var classMode = $("#toggle_event_editing").prop("class");
                            if (classMode == "btn-group")
                                $('#switch_status').text("Accepting Chats");
                            else
                                $('#switch_status').text("Not Accepting Chats");
                        }
                        break;
                }
            }
            catch (ex) { }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //try {
            //    if (wmsutil.checkSession(thrownError) == false) {
            //        wmsutil.sessionExpired(thrownError);
            //        return;
            //    }

            //    wmsutil.ajaxfyexception();
            //    wmsutil.customloader(0, 1000);
            //} catch (e) { }
        }
    });
}

function SwitchRoleMenu(roletype) {
    try {
        $("#hdnuserrole").val(roletype.trim(""));
        localStorage.setItem("roletype", roletype);
        switch (roletype) {
            case 'ADMIN':
                {
                    if ($("#hdnisacdenabled").val() == "1") { $("#tglChats").hide(); } else {
                        $("#tglChats").show();
                    }
                    $("#mnuadmin").show();
                    $("#mnuanalyst").hide();
                } break;
            case 'ANALYST':
                {
                    $("#tglChats").hide();
                    $("#mnuadmin").hide();
                    $("#mnuanalyst").show();
                } break;
            case 'AGENT':
                {
                    if ($("#hdnisacdenabled").val() == "1") { $("#tglChats").hide(); } else {
                        $("#tglChats").show();
                    }
                } break;
        }
    } catch (x) { }
}
function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function BindTeams(data) {
    var teamData = data.split('|');
    SwitchRoleMenu(teamData[1]);
    var teamsData = jQuery.parseJSON(teamData[0]);
    var accptChat = false;
    var agentstatus = "";
    var name = "";
    var html = "";
    for (var i = 0; i < teamsData.length; i++) {
        if (name != teamsData[i].depname) {
            if (name != "") {
                html = html + '</optgroup>'
            }
            name = teamsData[i].depname;
            html = html + '<optgroup class="ddlhdroptgrp" label="' + name + '">';
        }
        if (teamsData[i].LOGOPATH == null || teamsData[i].LOGOPATH == "" || teamsData[i].LOGOPATH == undefined) {
            teamsData[i].LOGOPATH = "LOGO/default-logo.jpg";
            // html = html + '<option value=' + teamsData[i].TEAMID + ' data-status=' + teamsData[i].STATUS + '>&lt;span class="ddicon"&gt;' + teamsData[i].TEAMNAME.substring(0, 1) + '&lt;/span&gt; ' + teamsData[i].TEAMNAME + '</option>';
        }
        html = html + '<option value=' + teamsData[i].TEAMID + ' data-status=' + teamsData[i].STATUS + ' data-image=' + teamsData[i].LOGOPATH + '>' + teamsData[i].TEAMNAME + '</option>';



    }
    $('#ddlhdrTeams').append(html);
    for (var i = 0; i < teamsData.length; i++) {
        if (teamsData[i].ISDEFAULT == "Y") {
            if (teamsData[i].TEAMID == $("#hdnteamid").val()) {
                $('#ddlhdrTeams').val(teamsData[i].TEAMID).attr('selected', 'true');
                $('#ddlhdrTeams').attr('data-pre', teamsData[i].TEAMID);
                if (teamsData[i].ACCEPT_CHATS) {
                    accptChat = true;
                }
                else {
                    accptChat = false;
                }
                agentstatus = teamsData[i].Agent_Status;
            }
        }
    }
    $("#ddlhdrTeams").msDropDown();
    try {
        if ($("#ddlhdrTeams_titleText").length > 0) {
            $("#ddlhdrTeams_titleText").removeAttr('disabled');
        }
    } catch (e) { }
    //if (accptChat) {
    //    $('#toggle_event_editing').prop("class", "btn-group");
    //    $('#switch_status').text("Accepting Chats");
    //    $('#chatactive').prop("class", "btn locked_inactive btn-default");
    //    $('#chatinactive').prop("class", "btn unlocked_active btn-info");
    //}
    //else {
    //    $('#toggle_event_editing').prop("class", "btn-group red");
    //    $('#switch_status').text("Not Accepting Chats");
    //    $('#chatinactive').prop("class", "btn btn-default unlocked_inactive");
    //    $('#chatactive').prop("class", "btn btn-info locked_active");
    //}


    //$('#teamagentstatus option').map(function () {
    //    if ($(this).text() == agentstatus) return this;
    //}).attr('selected', 'selected');
    //$("#teamagentstatus").msDropdown();

    // $('#teamagentstatus').attr('data-pre', agentstatus);



    CheckValidTeaminfo();
    GetChannelsList();
}

//function ChangeChatMode() {
//    wmsutil.sendAnalytics("header_toggle_status");
//    var classMode = $("#toggle_event_editing").prop("class");
//    var postData = "";
//    if (classMode == "btn-group")
//        postData = { chatmode: 1 };
//    else if (classMode == "btn-group red")
//        postData = { chatmode: 0 };

//    CallHandler_Header("chatsmode", "identity_chatsmode", postData);
//}

function sendDormentUrl(iTeamid) {
    try {
        //try { jQuery('#pageloader').fadeIn(); } catch (ee) { }
        try { wmsutil.customloader(0, 1); } catch (ee) { }
        var postInfo = { teamid: iTeamid }
        $.ajax({
            type: "POST",
            url: wmsutil.baseurl() + 'handlers/Users_Alladmins.ashx?ws=' + wmsutil.ws() + '&action=identity_senddormantlink',
            headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
            data: postInfo,
            async: true,
            success: function (msg) {
                if (wmsutil.checkSession(msg) == false) {
                    wmsutil.sessionExpired(msg);
                    return;
                }

                //try { jQuery('#pageloader').fadeOut(100); } catch (ee) { }
                try { wmsutil.customloader(0, 100); } catch (ee) { }
                if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                    var errormsg = msg.substring(6);
                    $("#modalDormant").modal('hide');
                    UIToastr('error', errormsg);
                    return;
                }
                if (msg.indexOf('success') >= 0 || msg.indexOf('SUCCESS') >= 0) {
                    var msg = msg.substring(8);
                    $("#modalDormant").modal('hide');
                    UIToastr('success', msg);
                    return;
                }
                //try { jQuery('#pageloader').fadeOut(1000); } catch (ee) { }
                try { wmsutil.customloader(0, 1000); } catch (ee) { }

            },
            error: function (xhr, err) {
                pageContentBody.html('<h4>Could not load the requested content.</h4>');
                pageContentBody.fadeIn();
                //  try { jQuery('#pageloader').fadeOut(1000); } catch (ee) { }
                try { wmsutil.customloader(0, 1000); } catch (ee) { }
            }
        });
    } catch (e) { }
}

function GetGUID() {

    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();; //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;

}

function GetAgentCustomStatuses() {
    try {
        var ws = document.getElementById('txtHdnWorkspaceId').value;
        $.ajax({
            url: $("#baseurl").val() + 'handlers/Users_alladmins.ashx?action=groupadmin_getagentchatstatussettings&ws=' + ws,
            type: 'POST',
            headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': GetGUID() },
            async: true,
            success: function (data) {
                if (wmsutil.checkSession(data) == false) {
                    wmsutil.sessionExpired(data);
                    return;
                }
                if (data.indexOf('REQUEST_INVALID') == 0) {
                    try {
                        wmsutil.requestInvalid();
                    } catch (e1) { }
                    return;
                }
                if (data != '' && data != undefined) {
                    var status = jQuery.parseJSON(data);
                    $('#teamagentstatus').html('');
                    for (var i = 0; i < status.length; i++) {
                        if (status[i]["status"] != "-1") {
                            var Options = $('<option>');
                            if (status[i]["id"] == "1" && status[i]["status_type"] == "1") {
                                Options.attr('data-image', "imichat/images/available.png");
                            }
                            else {
                                Options.attr('data-image', "imichat/images/not-available.png");
                            }
                            Options.attr('value', status[i].id).text(status[i].name);
                            $('#teamagentstatus').append(Options);
                        }
                    }

                    //$('#teamagentstatus option:selected').text($('#hdnagentchatstatus').val()).attr('selected', 'true');
                    //$('#teamagentstatus').attr('data-pre', $('#hdnagentchatstatus').val());

                    $('#teamagentstatus option').map(function () {
                        if ($(this).text() == $('#hdnagentchatstatus').val()) return this;
                    }).attr('selected', 'selected');
                    $("#teamagentstatus").attr("onchange", "ChangeChatMode()");
                    $("#teamagentstatus").msDropdown();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                UIToastr('error', errorThrown);
            }
        });
    } catch (e) { }
}

function ChangeChatMode() {
    wmsutil.sendAnalytics("header_toggle_status");
    var postData = "";
    var status = $("#teamagentstatus").val();
    if (parseInt(status) == 1)
        status = 1
    else
        status = 0;
    postData = { chatmode: status, agentstatus: $("#teamagentstatus option:selected").text(), agentstatusid: $("#teamagentstatus").val() };
    CallHandler_Header("chatsmode", "identity_chatsmode", postData);
}