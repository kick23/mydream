$(document).ready(function () {
    if (sessionStorage.getItem("clientteamload") == undefined || sessionStorage.getItem("clientteamload") == null) {
        $('#hgrpname').text(wmsutil.getDeptName());
        $('#spnDepName').text(wmsutil.getDeptName());
        setTimeout(function () {
            GrpAdmin_Getteamsbygroup();
        }, 500);
        sessionStorage.setItem("clientteamload", "1");
    } else {
        sessionStorage.removeItem("clientteamload");
    }
    AssignKeyupEvents();
});

function openTeamPopup() {
    wmsutil.destroyToolTip('#txtTeamName');
    $("input#txtTeamName").val("");
    $('#myModal').modal();
}

$("#trloading").remove();

function RedirectMe(teamId, teamName) {
    $("#hdnteamid").val(teamId);
    $("#hdnteamname").val(teamName);

    //  LoadAjaxifyUrl("groupteamusers");
    wmsutil.setTeamID(teamId);
    wmsutil.setTeamName(teamName);
    //window.location.href = 'groupadmin?p=groupteamusers';
    window.location.href = 'groupteamusers';
}

function AddTeam() {
    try {
        if (document.getElementById("txtTeamName").value.trim() == "") {
            wmsutil.showToolTip('#txtTeamName', "Name Field can not be blank", "top");
            return false;
        }
        var re = /^[a-zA-Z0-9@_-\s]+$/
        if (!re.test(document.getElementById("txtTeamName").value.trim())) {
            wmsutil.showToolTip('#txtTeamName', "Please enter Alphanumeric characters only.", "top");
            return false;
        }
        var ws = document.getElementById('txtHdnWorkspaceId').value;
        var postdata = '';
        //var curl = $("#baseurl").val() + "Handlers/Users_groupadmin.ashx?action=groupadmin_addteam&ws=" + ws + "&name=" + $('#txtTeamName').val().trim();
        var curl = $("#baseurl").val() + "Handlers/Users_groupadmin.ashx?action=groupadmin_addteam&ws=" + ws + "&depid=" + sessionStorage.getItem("deptid") + "&name=" + $('#txtTeamName').val().trim();
        $.ajax({
            url: curl,
            type: 'POST',
            headers: {
                'SESSTOKEN': $("#sesstoken").val(),
                'RTN': wmsutil.getGUID()
            },
            async: true,
            data: postdata,
            contentType: "application/json; charset=utf-8",
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
                if (data == "-1") {
                    UIToastr('error', "something went wrong.please tryagain..");
                } else if (data == "1") {
                    UIToastr('error', "Name is already Exists");
                } else {
                    window.location.reload();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                UIToastr('error', errorThrown);
            }
        });
    } catch (e) { }
}

function Editteamname() {
    try {
        if ($("#txteditname").val() == "") {
            UIToastr('error', "Team Name Should not be Empty.");
            return;
        }
        var ws = document.getElementById('txtHdnWorkspaceId').value;
        var teamid = $('#hdneteamid').val();
        var postdata = '';
        var curl = $("#baseurl").val() + "Handlers/Users_groupadmin.ashx?action=groupadmin_updateteamname&ws=" + ws + "&name=" + $('#txteditname').val().trim() + "&teamid=" + teamid;
        $.ajax({
            url: curl,
            type: 'POST',
            headers: {
                'SESSTOKEN': $("#sesstoken").val(),
                'RTN': wmsutil.getGUID()
            },
            async: true,
            data: postdata,
            contentType: "application/json; charset=utf-8",
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
                if (data == "1") {
                    UIToastr('error', "Team Name '" + $("#txteditname").val() + "' already Exists.");
                } else {
                    UIToastr('success', "Team Name updated successfully.");
                    $("#diveditteammodal").modal('hide');
                    // setTimeout(function () { window.location.reload(); }, 500);
                    $("#hdnteamname_" + teamid).val($('#txteditname').val().trim());
                    $("#ancteamid_" + teamid).text($('#txteditname').val().trim());
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                UIToastr('error', errorThrown);
            }
        });

    } catch (e) { }
}

function GrpAdmin_Getteamsbygroup() {
    try {
        var ws = $('#txtHdnWorkspaceId').val();
        if (ws == undefined) {
            ws = "smschat"
        }
        var deptid = wmsutil.getDeptID();
        var deptname = wmsutil.getDeptName();
        var curl = $("#baseurl").val() + "Handlers/Users_groupadmin.ashx?action=groupadmin_grpadmingetteamsbydept&ws=" + ws;
        $.ajax({
            type: "POST",
            url: curl,
            headers: {
                'SESSTOKEN': $("#sesstoken").val(),
                'RTN': wmsutil.getGUID()
            },
            data: "deptid=" + deptid,
            dataType: 'json',
            async: true,
            success: function (jsonRes) {
                sessionStorage.removeItem("clientteamload");

                if (wmsutil.checkSession(jsonRes) == false) {
                    wmsutil.sessionExpired(jsonRes);
                    return;
                }
                if (jsonRes != '' && jsonRes != undefined) {
                    //if (jsonRes.indexOf('SESSIONEXPIRED') == 0 || jsonRes.indexOf('SESSION_EXPIRED') == 0) {
                    //    wmsutil.sessionExpired();
                    //    return;
                    //}
                    //if (jsonRes.indexOf('REQUEST_INVALID') == 0) {
                    //    try {
                    //        wmsutil.requestInvalid();
                    //    } catch (e1) { }
                    //    return;
                    //}
                    $("#tblgrpadmin tbody").html('');
                    var loading = "<tr id='trloading'><td colspan='5'> loading...</td></tr>";
                    if (jsonRes != "" || jsonRes.length > 0) {
                        $("#tblgrpadmin tbody").append(loading);
                        var tbllogs = "";
                        try {

                            for (var i = 0; i < jsonRes.length; i++) {
                                tbllogs = "<tr id=team_" + jsonRes[i].TEAMID + ">";
                                if (jsonRes[i].LOGOPATH == null || jsonRes[i].LOGOPATH == "") {
                                    tbllogs = tbllogs + "<td><img src=\"LOGO/default-logo.jpg\"></td>";
                                } else {
                                    tbllogs = tbllogs + "<td><img src=" + jsonRes[i].LOGOPATH + "></td>";
                                }
                                tbllogs = tbllogs + "<td><input type='hidden' id='hdnteamname_" + jsonRes[i].TEAMID + "' name='teamname' value='" + jsonRes[i].TEAMNAME + "'/><a id='ancteamid_" + jsonRes[i].TEAMID + "' onclick='RedirectMe(" + jsonRes[i].TEAMID + ",\"" + jsonRes[i].TEAMNAME + "\")'>" + jsonRes[i].TEAMNAME + "</a><a onclick='Renameteam(" + jsonRes[i].TEAMID + ")'><i class='fa fa-pencil'></i></a></td>";
                                tbllogs = tbllogs + "<td>";
                                if (jsonRes[i].CHANNELS != null) {
                                    var Channels = jsonRes[i].CHANNELS.split(',');
                                    if (Channels.length > 0) {
                                        for (var k = 0; k < Channels.length; k++) {
                                            if (Channels[k] == 1) {
                                                //tbllogs = tbllogs + "<img title='SMS' src='imichat/images/chaticon-active-n.png'/>";
                                                tbllogs = tbllogs + "<i class='iconch1 padright_5' data-toggle='tooltip' title='SMS' data-original-title='SMS' data-placement='top'></i>";
                                            }
                                            if (Channels[k] == 2) {
                                                //tbllogs = tbllogs + "<img title='Facebook' src='imichat/images/fbicon-active-n.png'/>";
                                                tbllogs = tbllogs + "<i class='iconch2 padright_5' data-toggle='tooltip' title='Facebook' data-original-title='Facebook' data-placement='top'></i>";
                                            }
                                            if (Channels[k] == 3) {
                                                //tbllogs = tbllogs + "<img title='WebChat' src='imichat/images/webchaticon-active.png'/>";
                                                tbllogs = tbllogs + "<i class='iconch3 padright_5' data-toggle='tooltip' title='LiveChat' data-original-title='LiveChat' data-placement='top'></i>";
                                            }
                                            if (Channels[k] == 4) {
                                                //tbllogs = tbllogs + "<img title='Twitter' src='imichat/images/twittericon-active-n.png'/>";
                                                tbllogs = tbllogs + "<i class='iconch4 padright_5' data-toggle='tooltip' title='Twitter' data-original-title='Twitter' data-placement='top'></i>";
                                            }
                                            if (Channels[k] == 5) {
                                                //tbllogs = tbllogs + "<img title='Email' src='imichat/images/emailicon-active-n.png'/>";
                                                tbllogs = tbllogs + "<i class='iconch5 padright_5' data-toggle='tooltip' title='Email' data-original-title='Email' data-placement='top'></i>";
                                            }
                                            if (Channels[k] == 9) {
                                                //tbllogs = tbllogs + "<img title='API' src='imichat/images/generic-active-n.png'/>";
                                                tbllogs = tbllogs + "<i class='iconch9 padright_5' data-toggle='tooltip' title='API' data-original-title='API' data-placement='top'></i>";
                                            }
                                        }
                                        $('[data-toggle="tooltip"]').tooltip();
                                    }
                                }
                                tbllogs = tbllogs + "</td>";
                                tbllogs = tbllogs + "<td>" + jsonRes[i].ADMINS + "</td>";
                                tbllogs = tbllogs + " <td>" + jsonRes[i].AGENTS + "</td>";
                                tbllogs = tbllogs + " <td>" + jsonRes[i].OTHERS + "</td>";
                                tbllogs = tbllogs + "<td><a title='Delete' onclick='Getteamassetslist(" + jsonRes[i].TEAMID + ",\"" + jsonRes[i].TEAMNAME + "\")'><i class='fa fa-trash'></i></a></td>";

                                tbllogs = tbllogs + "</tr>";
                                $("#tblgrpadmin tbody").append(tbllogs);
                                Channels = [];
                            }
                        } catch (e) { }
                    } else {
                        $("#tblgrpadmin tbody").html('');
                        $("#tblgrpadmin tbody").append("<tr id='trloading'><td colspan='6'> No Teams Found.Click on Add Team button to add./td></tr>");
                    }
                    $("#trloading").remove();
                } else {
                    $("#tblgrpadmin tbody").html('');
                    $("#tblgrpadmin tbody").append("<tr id='trloading'><td colspan='6'> No Records...</td></tr>");
                }
            },
            error: function (jqXHR, textStatus) {
                wmsutil.ajaxfyexception();
                try {
                    wmsutil.customloader(0, 1000);
                } catch (ee) { }
            }
        });
    } catch (e) { }
}

function Renameteam(id) {
    try {

        $("#diveditteammodal").modal('show');
        $("#txteditname").val($("#hdnteamname_" + id).val());
        $("#hdneteamid").val(id);
    } catch (e) { }
}

function Getteamassetslist(teamid, teamname) {
    try {
        var ws = document.getElementById('txtHdnWorkspaceId').value;
        sessionStorage.setItem('del_teamid', teamid);
        sessionStorage.setItem('del_teamname', teamname);
        var curl = $("#baseurl").val() + "Handlers/Users_groupadmin.ashx?action=groupadmin_checkassetsfordeletedteam&ws=" + ws;
        $.ajax({
            type: "POST",
            url: curl,
            headers: {
                'SESSTOKEN': $("#sesstoken").val(),
                'RTN': wmsutil.getGUID()
            },
            data: "teamid=" + teamid,
            dataType: 'json',
            async: true,
            success: function (msg) {
                if (wmsutil.checkSession(msg) == false) {
                    wmsutil.sessionExpired(msg);
                    return;
                }
                if (msg != '' && msg.length != undefined) {
                    $("#tblassets tbody").html('');
                    var tbllogs = "";
                    try {
                        if (msg.length == 1 && msg[0].assetname == "$nodeleteteam$") {
                            $("#divdeleteoneteaminfo").modal('show');
                        }
                        else {
                            for (var i = 0; i < msg.length; i++) {
                                tbllogs = "<tr>";
                                tbllogs = tbllogs + "<td>" + msg[i].channel + "</td>";
                                tbllogs = tbllogs + "<td>" + msg[i].assetname + "</td>";
                                tbllogs = tbllogs + "</tr>";
                                $("#tblassets tbody").append(tbllogs);
                            }
                            $("#divdeleteassetinfopopup").modal('show');
                        }
                    } catch (e) { }
                }
                else { $("#divdeleteteaminfo").modal('show'); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                UIToastr('error', errorThrown);
            }
        });
    } catch (e) { }
}

function DeleteTeam(val) {
    if (val == 1) {
        $("#txtpassword").val('');
        $("#divdeleteteaminfo").modal('hide');
        $("#divdeleteteam").modal('show');
        return;
    }
    if ($("#txtpassword").val() == '') {
        UIToastr('error', "Please enter password");
        return false;
    }
    var ws = document.getElementById('txtHdnWorkspaceId').value;
    var teamid = sessionStorage.getItem('del_teamid');
    var teamname = sessionStorage.getItem('del_teamname');
    var postData = 'teamid=' + teamid + '&teamname=' + teamname + '&password=' + $("#txtpassword").val();
    var curl = $("#baseurl").val() + "Handlers/Users_groupadmin.ashx?action=groupadmin_deleteteam&ws=" + ws;
    $.ajax({
        type: "POST",
        url: curl,
        headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
        data: postData,
        async: true,
        success: function (msg) {
            if (wmsutil.checkSession(msg) == false) {
                wmsutil.sessionExpired(msg);
                return;
            }
            if (msg == "1") {
                $("#divdeleteteaminfo").modal('hide');
                $("#divdeleteteam").modal('hide');
                $("tr#team_" + teamid).remove();
                UIToastr('success', "Team: " + sessionStorage.getItem('del_teamname') + " would be deleted shortly.");
                sessionStorage.setItem('del_teamid', null);
                sessionStorage.setItem('del_teamname', null);
                return false;
            }
            if (msg == "2") {
                UIToastr('error', "Please enter correct password");
                return false;
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

function InsertAgentCustomStatus() {
    try {
        var ws = document.getElementById('txtHdnWorkspaceId').value;
        $("div.client-agent-settings-cont li").find("input.").each(function () {

        });
        var curl = $("#baseurl").val() + "Handlers/Users_groupadmin.ashx?action=groupadmin_insertagentchatstatussettings&ws=" + ws;
        $.ajax({
            url: curl,
            type: 'POST',
            headers: {
                'SESSTOKEN': $("#sesstoken").val(),
                'RTN': wmsutil.getGUID()
            },
            async: true,
            data: postdata,
            contentType: "application/json; charset=utf-8",
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

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                UIToastr('error', errorThrown);
            }
        });
    } catch (e) { }
}

function GetAgentCustomStatuses() {
    try {
        var ws = document.getElementById('txtHdnWorkspaceId').value;
        var curl = $("#baseurl").val() + "Handlers/Users_groupadmin.ashx?action=groupadmin_getagentchatstatussettings&ws=" + ws;
        $.ajax({
            url: curl,
            type: 'POST',
            headers: {
                'SESSTOKEN': $("#sesstoken").val(),
                'RTN': wmsutil.getGUID()
            },
            async: true,
            contentType: "application/json; charset=utf-8",
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
                    var strtemp = "<ul id=\"ullist\">";
                    var listdata = JSON.parse(data);
                    var imgavail = "";
                    for (var i = 0; i < listdata.length; i++) {
                        if (listdata[i].status != -1) {
                            if (listdata[i].status_type == "1") {
                                imgavail = "imichat/images/available.png";
                            }
                            else {
                                imgavail = "imichat/images/not-available.png";
                            }
                            strtemp += "<li class=\"lilist\" id=\"li_" + listdata[i].id + "\"><img src=\"" + imgavail + "\" class=\"client-status-img\"><span class=\"client-status-cont\"><span class=\"status\" id=\"\" title=\"Alias\"><span class=\"spnname\" id=\"spnname_" + listdata[i].id + "\">" + listdata[i].name + "</span></span>";
                            strtemp += "<span class=\"editbox-cont\" id=\"spneditstatus_" + listdata[i].id + "\" style=\"display:none\">";
                            strtemp += "<input maxlength ='20' class=\"editbox wms-val-alphanumeric\" id=\"txtname_" + listdata[i].id + "\" data-id =\"" + listdata[i].id + "\" max-id =\"" + listdata[listdata.length - 1].id + "\" maxlength=\"50\" type=\"text\" value=\"" + listdata[i].name + "\">";
                            strtemp += "<a href=\"#\" onclick=\"HideEditstatus(" + listdata[i].id + ")\"><i class=\"fa fa-close\"></i></a>";
                            strtemp += "<a href=\"#\" onclick=\"updatestatus(" + listdata[i].id + ")\"><i class=\"fa fa-check\"></i></a>";
                            strtemp += "</span>";
                            strtemp += "<i class=\"fa fa-pencil edit\" data-original-title=\"Edit Status\" data-placement=\"top\" data-toggle=\"tooltip\" id=\"editalias_" + listdata[i].id + "\" onclick=\"Editstatus(" + listdata[i].id + ")\"></i>";
                            if (i > 1) {
                                strtemp += "<i class=\"fa fa-trash delete\" data-original-title=\"Delete Status\" data-placement=\"top\" data-toggle=\"tooltip\" id=\"deletestatus_" + listdata[i].id + "\" onclick=\"Deletestatus(" + listdata[i].id + ")\"></i>";
                            }
                            strtemp += "</span>";
                            strtemp += "</li>";
                        }
                    }
                    strtemp += "</ul><input type=\"hidden\" id =\"statuslist\" name=\"statuslist\">";
                    $("#divstatuses").html(strtemp);
                    var id = parseInt($("div.client-agent-settings-cont li").length);
                    if (id >= 5) {
                        $("#btnaddstatus").addClass("disabled");
                        $("#btnaddstatus").removeAttr("onclick", "Addstatuscontrol()");
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                UIToastr('error', errorThrown);
            }
        });
    } catch (e) { }
}

function Editstatus(ctrl) {
    try {
        if ($("#txtname_" + ctrl).hasClass("newli")) {
            return;
        }
        var postData = {
            "status": $("#txtname_" + ctrl).val()
        };
        var ws = document.getElementById('txtHdnWorkspaceId').value;
        var curl = $("#baseurl").val() + "Handlers/Users_groupadmin.ashx?action=groupadmin_checkeditstatus&ws=" + ws;
        $.ajax({
            url: curl,
            type: 'POST',
            headers: {
                'SESSTOKEN': $("#sesstoken").val(),
                'RTN': wmsutil.getGUID()
            },
            data: postData,
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
                    if (data == "1") {
                        UIToastr('error', "This status is being used by one of your active agents and hence cannot be modified or deleted.");
                        return false;
                    }
                    else if (data == "0") {
                        $("#txtname_" + ctrl).removeClass('editbox');
                        $("#spnname_" + ctrl).hide();
                        $("#editalias_" + ctrl).hide();
                        $("#deletestatus_" + ctrl).hide();
                        $("#spneditstatus_" + ctrl).show();
                        $("#btnaddstatus").addClass("disabled");
                        $("#btnaddstatus").removeAttr("onclick");
                        $("#btnSubmit").addClass("disabled");
                        $("#btnSubmit").removeAttr("onclick");
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                UIToastr('error', errorThrown);
            }
        });

    } catch (e) { }
}

function HideEditstatus(ctrl) {
    try {
        $("#txtname_" + ctrl).addClass('editbox');
        $("#spneditstatus_" + ctrl).hide();
        $("#editalias_" + ctrl).show();
        $("#deletestatus_" + ctrl).show();
        $("#spnname_" + ctrl).show();
        $("#btnaddstatus").removeClass("disabled");
        $("#btnaddstatus").attr("onclick", "Addstatuscontrol()");
        $("#btnSubmit").removeClass("disabled");
        $("#btnSubmit").attr("onclick", "Savestatuses()");
    } catch (e) { }
}
function Deletestatus(ctrl) {
    try {
        if ($("#txtname_" + ctrl).hasClass("newli")) {
            $("#li_" + ctrl).remove();
            return;
        }
        var postData = {
            "status": $("#txtname_" + ctrl).val()
        };
        var ws = document.getElementById('txtHdnWorkspaceId').value;
        var curl = $("#baseurl").val() + "Handlers/Users_groupadmin.ashx?action=groupadmin_checkeditstatus&ws=" + ws;
        $.ajax({
            url: curl,
            type: 'POST',
            headers: {
                'SESSTOKEN': $("#sesstoken").val(),
                'RTN': wmsutil.getGUID()
            },
            data: postData,
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
                    if (data == "1") {
                        UIToastr('error', "This status is being used by one of your active agents and hence cannot be modified or deleted.");
                        return false;
                    }
                    else if (data == "0") {
                        $("#divstatuses").find("#li_" + ctrl).hide();
                        $("#spnname_" + ctrl).addClass("disable");
                        $("#txtname_" + ctrl).addClass("disable");
                        $("#editalias_" + ctrl).hide();
                        $("#deletestatus_" + ctrl).hide();
                        $("#btnaddstatus").removeClass("disabled");
                        $("#btnaddstatus").attr("onclick", "Addstatuscontrol()");
                        $("#btnSubmit").removeClass("disabled");
                        $("#btnSubmit").attr("onclick", "Savestatuses()");
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                UIToastr('error', errorThrown);
            }
        });

    } catch (e) { }
}

function updatestatus(ctrl) {
    debugger;
    try {
        var duplicate = 0;
        var current = $("#txtname_" + ctrl).val();
        var inputs = $('.editbox');
        for (var i = 0 ; i < inputs.length; i++) {
            if (inputs[i].value == current) {
                duplicate = 1;
            }
        }
        if (duplicate == 1) {
            UIToastr('error', "Duplicate status entered.");
            return false;
        }
        $("#txtname_" + ctrl).addClass('editbox');
        $("#editalias_" + ctrl).hide();
        $("#spneditstatus_" + ctrl).hide();
        $("#editalias_" + ctrl).show();
        $("#spnname_" + ctrl).show();
        $("#deletestatus_" + ctrl).show();
        $("#btnSubmit").removeClass("disabled");
        $("#btnSubmit").attr("onclick", "Savestatuses()");
        //$("#txtname_" + ctrl).val($("#spnname_" + ctrl).text());
        $("#spnname_" + ctrl).text($("#txtname_" + ctrl).val());
        $("#txtname_" + ctrl).val($("#spnname_" + ctrl).text());

    } catch (e) { }
}

function Deleterowstatus(ctrl) {
    try {
        $("#divstatuses").find("#li_" + ctrl).remove();
        $("#btnaddstatus").removeClass("disabled");
        $("#btnaddstatus").attr("onclick", "Addstatuscontrol()");
        $("#btnSubmit").removeClass("disabled");
        $("#btnSubmit").attr("onclick", "Savestatuses()");
    } catch (e) { }
}

function Addstatuscontrol() {
    debugger;
    try {
        var id = parseInt($('#ullist li').last().attr('id').split('_')[1]) + 1; //parseInt($("div.client-agent-settings-cont li").length) + 1;
        var strtemp = "";
        strtemp += "<li class=\"lilist\" id=\"li_" + id + "\">";
        strtemp += "<span class=\"editbox-cont\" id=\"spneditstatus_" + id + "\" style=\"display:block\">";
        strtemp += "<input class=\"wms-val-alphanumeric editboxnew\" id=\"txtaddstatus\" maxlength=\"20\" type=\"text\" value=\"\">";
        strtemp += "<a href=\"#\" onclick=\"Savesinglestatus(" + id + ")\"><i class=\"fa fa-check\"></i></a>";
        strtemp += "<i class=\"fa fa-trash delete\" data-original-title=\"Delete Status\" data-placement=\"top\" data-toggle=\"tooltip\" id=\"deletestatus_" + id + "\" onclick=\"Deleterowstatus(" + id + ")\"></i>";
        strtemp += "</span>";
        strtemp += "</li>";
        $("#divstatuses ul").append(strtemp);
        $("#btnaddstatus").addClass("disabled");
        $("#btnaddstatus").removeAttr("onclick");
        $("#btnSubmit").addClass("disabled");
        $("#btnSubmit").removeAttr("onclick");
    } catch (e) { }
}

function Savesinglestatus(id) {
    debugger;
    try {
        var strtemp = "";
        var txtaddstatus = $("#txtaddstatus").val();
        if (txtaddstatus.length == 0) {
            UIToastr('error', "Please enter agent status.");
            return false;
        }
        var inputs = $('.editbox');
        var duplicate = 0;
        inputs.each(function () {
            var current = $("#txtaddstatus").val();
            inputs.each(function () {
                if (current == $(this).val() && !$(this).hasClass('disable')) {
                    duplicate = 1;
                }
            });
        });

        if (duplicate == 0) {
            var maxid = parseInt($('#' + $('.editbox')[$('.editbox').length - 1].id).attr("max-id")) + 1;
            $("#divstatuses").find("#li_" + id).remove();
            strtemp += "<li class=\"lilist\" id=\"li_" + maxid + "\"><img src=\"imichat/images/not-available.png\" class=\"client-status-img\"><span class=\"client-status-cont\"><span class=\"status\" id=\"\" title=\"Alias\"><span class=\"spnname\" id=\"spnname_" + maxid + "\">" + txtaddstatus + "</span></span>";
            strtemp += "<span class=\"editbox-cont\" id=\"spneditstatus_" + maxid + "\" style=\"display:none\">";
            strtemp += "<input maxlength ='20' class=\"wms-val-alphanumeric editbox newli\" id=\"txtname_" + maxid + "\" maxlength=\"50\" type=\"text\" value=\"" + txtaddstatus + "\" data-id =\"" + maxid + "\" max-id =\"" + maxid + "\">";
            strtemp += "<a href=\"#\" onclick=\"HideEditstatus(" + maxid + ")\"><i class=\"fa fa-close\"></i></a>";
            strtemp += "<a href=\"#\" onclick=\"\"><i class=\"fa fa-check\"></i></a>";
            strtemp += "</span>";
            strtemp += "<i class=\"fa fa-pencil edit\" data-original-title=\"Edit Status\" data-placement=\"top\" data-toggle=\"tooltip\" id=\"editalias_" + maxid + "\" onclick=\"Editstatus(" + maxid + ")\"></i>";
            strtemp += "<i class=\"fa fa-trash delete\" data-original-title=\"Delete Status\" data-placement=\"top\" data-toggle=\"tooltip\" id=\"deletestatus_" + maxid + "\" onclick=\"Deletestatus(" + maxid + ")\"></i>";
            strtemp += "</span>";
            strtemp += "</li>";
            $("#divstatuses ul").append(strtemp);
            $("#btnaddstatus").removeClass("disabled");
            $("#btnaddstatus").attr("onclick", "Addstatuscontrol()");
            $("#btnSubmit").removeClass("disabled");
            $("#btnSubmit").attr("onclick", "Savestatuses()");
        }
        else {
            UIToastr('error', "Duplicate status entered.");
            return false;
        }
        var id = parseInt($("div.client-agent-settings-cont li:visible").length);
        if (id >= 5) {
            $("#btnaddstatus").addClass("disabled");
            $("#btnaddstatus").removeAttr("onclick", "Addstatuscontrol()");
        }
    } catch (e) { }

}

function Savestatuses() {
    try {
        debugger;
        var postdata = "";
        var inputs = $('.editbox');
        var array = [];
        var statustype = '';
        var status = '';
        var id = '';
        $('.editbox').each(function (index) {
            if (index == 0)
                statustype = 1;
            else
                statustype = 0;
            if ($(this).hasClass("disable"))
                status = -1;
            else
                status = 1;
            array.push({ id: $(this).attr('data-id'), name: this.value, statustype: statustype, status: status });
        });
        var jspost = { statuslist: JSON.stringify(array) };
        $("#statuslist").val(JSON.stringify(array));
        postdata = "&statuslist='" + JSON.stringify(array) + "'";
        var ws = document.getElementById('txtHdnWorkspaceId').value;
        var curl = $("#baseurl").val() + "Handlers/Users_groupadmin.ashx?action=groupadmin_insertagentchatstatussettings&ws=" + ws;
        $.ajax({
            url: curl,
            type: 'POST',
            headers: {
                'SESSTOKEN': $("#sesstoken").val(),
                'RTN': wmsutil.getGUID()
            },
            data: jspost,
            async: true,
            //contentType: "application/json",
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
                GetAgentCustomStatuses();
                UIToastr('success', "Statuses added successfully.");
                return false;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                UIToastr('error', errorThrown);
            }
        });
    }
    catch (e) { }
}