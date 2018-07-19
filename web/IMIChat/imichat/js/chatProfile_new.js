var chatProfile = function () {

    var totObj = "";
    var userDetails = $("#userdetails");

    var bindProfileData = function (c) {

        totObj = c;
        $(userDetails).html(userProfileData(c));

        $(userDetails).append(otherDetails(c));

        $('.mightOverflow').bind('mouseenter', function () {
            var $this = $(this);

            if (this.offsetWidth < this.scrollWidth) {
                $this.attr('data-toggle', 'tooltip');
                $this.tooltip('show');
                $('[data-toggle="tooltip"]').tooltip();
            }
        });
        setTimeout(function () { $('[data-toggle="tooltip"]').tooltip(); }, 100);
        ProfileSettingsScroll();
        $('#txtprof_edtwitterid').on('keyup', function () {
            $(this).val($(this).val().replace(/[<>]+/g, ''));
            $(this).focus();
            return;
        });
        wss.nicescroll("#potherdetails");
        if (datamask.getdata() != "" && datamask.getdata() != null && datamask.getdata() != "null") {
            $("#aprof_custid").remove();
            $("#aprof_custname").remove();
        }
    }
    var userProfileData = function (c) {
        var pData = "<div class=\"profile\">" +
                  userInfoLeftSection(c) +
                  uerInfoMiddleSection(c) +
                  uerInfoRigthSection(c) +
               "<div class=\"clearfix\"></div></div>";


        $("#aprof_refresh").tooltip();
        $("#aprof_dnd").tooltip();
        $("#aprof_conflict").tooltip();
        return pData;
    }
    var userInfoLeftSection = function (c) {
        var purl = wss.wsurl() + "/images/usericon.png";
        if (!datamask.checkfieldtomask("fbprofilepic")) {
            if (c.profile.profilepic != "") {
                purl = c.profile.profilepic
            }
        }
        return "<div class=\"leftsec\"><div style=\"background-image:url('" + purl + "')\" class=\"useicon\"></div></div>";
        // return "<div class='leftsec'><img src='" + wss.wsurl() + "images/usericon.png' class='useicon'></div>";
    }
    var uerInfoMiddleSection = function (c) {
        debugger;
        var cProfile = c.profile;
        var cCaseDetails = c.casedetails;
        var custom_profile_params = c.custom_profile_params;
        var cMeta = c.meta;
        var cInfo = c.info;

        var custName = "";
        var custId = "";

        if (cProfile != null) {

            custName = cProfile.customername;
            custId = cProfile.customerid;
        }


        // Added for IPR-95287 bugfix
        if (cInfo.channel == "4" && (custName == "" && custName == undefined)) {
            if (cProfile.twitterid != null) {
                if (cProfile.twitterid.split(',').length > 1)
                { custName = cProfile.twitterid.split(',')[1]; }
                else
                { custName = cProfile.twitterid; }
            }
            else { custName = cInfo.mob; }
        }
        //end
        if (custName == "" || custName == undefined) {
            custName = cInfo.mob;
        }
        var chatId = cInfo.chatid;
        var formedHTML = "";
        var conflict = "N";
        var confCustid = "0";



        if (custId == "" || custId == undefined) {
            formedHTML = "<div class=\"middlesec\"> <div class=\"custdiv\"> <h3 class=\"username\" id=\"spnprof_custname\"  data-original-title=\"Customer Name\" data-placement=\"top\" data-toggle=\"tooltip\">" + datamask.checkgetdata("customername", custName) + "</h3>" +
                       "<div class=\"clearfix\"></div></div><div class=\"customidcont\"><span class=\"custId\" id=\"spnprof_custid\">[Customer Id]</span>" +
                       "<a class=\"editcont\" id=\"aprof_custid\" onclick=\"chatProfile.EditCustId();\" ><i class=\"fa fa-pencil edit\"></i></a> " +
                       "<span class=\"editbox-cont\" style=\"display:none\" id=\"spnprof_edcustid\"><input type=\"text\" class=\"editbox\" id=\"txtprof_edcustid\"  maxlength = \"200\"><a href=\"#\" onclick=\"chatProfile.HideEditCustId();\"><i class=\"fa fa-close\" ></i></a><a href=\"#\" onclick=\"chatProfile.UpdateCustId('" + chatId + "');\"><i class=\"fa fa-check\"></i></a></span>" +
                       "</div></div>";
        }
        else {

            formedHTML = "<div class=\"middlesec\"> <div class=\"custdiv\"> <h3 class=\"username\" id=\"spnprof_custname\" data-original-title=\"Customer Name\" data-placement=\"top\" data-toggle=\"tooltip\">" + datamask.checkgetdata("customername", custName) + "</h3>" +
                       "<a class=\"editcont\" id=\"aprof_custname\" onclick=\"chatProfile.EditName();\" ><i class=\"fa fa-pencil edit\"></i></a> " +
                       "<span class=\"editbox-cont\" style=\"display:none\" id=\"spnprof_edcustname\">" +
                       "<input type=\"text\" class=\"editbox\" id=\"txtprof_edcustname\" maxlength = \"200\">" +
                       "<a href=\"#\" onclick=\"chatProfile.HideEditName();\"><i class=\"fa fa-close\" ></i></a>" +
                       "<a href=\"#\" onclick=\"chatProfile.UpdateName('" + custId + "');\"><i class=\"fa fa-check\"></i></a></span>" +
                       "<div class=\"clearfix\"></div></div> " +
                       "<div class=\"customidcont\"><span class=\"custId\">" +
                       "<span class=\"color-lightgrey\">Customer ID:</span><span  id=\"spnprof_custid\" >" + custId + "</span></span>" +/*data-toggle=\"tooltip\" data-original-title=\"" + custId + "\"  data-placement=\"left\"*/
                       "<a class=\"editcont\" id=\"aprof_custid\" onclick=\"chatProfile.EditCustId();\" ><i class=\"fa fa-pencil edit\"></i></a> " +
                       "<span class=\"editbox-cont\" style=\"display:none\" id=\"spnprof_edcustid\">" +
                       "<input type=\"text\" class=\"editbox\" id=\"txtprof_edcustid\"  maxlength = \"200\">" +
                       "<a href=\"#\" onclick=\"chatProfile.HideEditCustId();\"><i class=\"fa fa-close\" ></i></a>" +
                       "<a href=\"#\" onclick=\"chatProfile.UpdateCustId('" + chatId + "');\"><i class=\"fa fa-check\"></i></a></span>" +
                       "</div></div>";
            //            }
        }

        return formedHTML;
    }
    var uerInfoRigthSection = function (c) {

        var cProfile = c.profile;
        var cCaseDetails = c.casedetails;
        var cMeta = c.meta;
        var cInfo = c.info;

        var dndStatus = cProfile.dndstatus;
        var rData = "";

        if (dndStatus == "1") {
            rData = "<div class=\"rightsec\">" +
			         "<a id=\"aprof_dnd\" class=\"blkbtn active\"  title=\"\" data-toggle=\"tooltip\" data-original-title=\"Customer exist in 'Do-not-disturb' list\"  data-placement=\"left\"><span class=\"icon-block\"></span></a>" +
                      "</div><div class=\"clearfix\"></div></div>";
        }
        else {
            rData = "<div class=\"rightsec\">" +
			          "<a id=\"aprof_dnd\" class=\"blkbtn\"  title=\"\" data-toggle=\"tooltip\" data-original-title=\"Add the customer to the 'Do-not-disturb' list\"  data-placement=\"left\" onclick=\"chatProfile.DNDUser('" + cInfo.chatid + "');\"><span class=\"icon-block\"></span></a>" +
                      "</div><div class=\"clearfix\"></div></div>";
        }

        return rData;

    }

    var otherDetails = function (c) {
        return "<ul class=\"nav nav-tabs custdetails-tabs-icons\" role=\"tablist\" style=\"display:none;\">" +
                 "<li role=\"presentation\" class=\"active\"><a href=\"#custdetails-general\" aria-controls=\"home\" role=\"tab\" data-toggle=\"tab\"><i class=\"fa fa-user\"></i></a></li>" +
                 "<li role=\"presentation\"><a href=\"#custdetails-zendesk\" aria-controls=\"profile\" role=\"tab\" data-toggle=\"tab\"><i class=\"fa  fa-youtube\"></i></a></li>" +
                 "<li role=\"presentation\"><a href=\"#custdetails-salesforce\" aria-controls=\"messages\" role=\"tab\" data-toggle=\"tab\"><i class=\"fa fa-whatsapp\"></i></a></li>" +
                "</ul>" +
                "<div class=\"tab-content custdetails-tabs-content\">" +
                "<div role=\"tabpanel\" class=\"tab-pane active\" id=\"custdetails-general\">" +
                "<div class=\"otherdetails\" id=\"potherdetails\">" + conHistory(c) +// "</div>" +
                "<div class=\"custnotes-section\">" + customernotes(c) + "</div>" +
                "<div class=\"panel-group channel-details\" id=\"accordionchanneldetails\" role=\"tablist\" aria-multiselectable=\"true\">" + channelData(c) + "</div>" +
                "<div class=\"panel-group channel-details\" id=\"accordioncasedetails\" role=\"tablist\" aria-multiselectable=\"true\">" + caseDetails(c) + "</div>" +

                 "</div></div></div>" +
                "<div role=\"tabpanel\" class=\"tab-pane\" id=\"custdetails-zendesk\" style=\"display:none;\">custdetails-zendesk</div>" +
                "<div role=\"tabpanel\" class=\"tab-pane\" id=\"custdetails-salesforce\" style=\"display:none;\">custdetails-salesforce</div>" +
                "</div>";
    }
    var conHistory = function (c) {
        var cProfile = c.profile;
        var data = '<label>Chat history</label>';
        data += "<a class=\"alinks\" onclick=\"chatProfile.Viewhistory('" + c.info.chatid + "');\">(View full)</a><br/>"
        var cntr = 0;
        if (cProfile.datefirst != "") {
            data += "<div class=\"consoledetailrow\"><span class=\"left\">First seen</span><span class=\"middle\">:</span><span class=\"right\" >" + cProfile.datefirst + "</span></div>";
            cntr++;
        }
        if (cProfile.datelastmo != "") {
            data += "<div class=\"consoledetailrow\"><span class=\"left\">Last contacted</span><span class=\"middle\">:</span><span class=\"right\" >" + cProfile.datelastmo + "</span></div>";
            cntr++;
        }
        if (cProfile.totalchats != "") {
            data += "<div class=\"consoledetailrow\"><span class=\"left\">Total chats</span><span class=\"middle\">:</span><span class=\"right\" >" + cProfile.totalchats + "</span></div>";
            cntr++;
        }

        if (cntr == 0) data = "";

        return data;
    }
    var customernotes = function (c) {
        var data = "<label>Customer notes</label><a class=\"alinks\" onclick=\"chatSend.openCustomerPopUp();\">(View History)</a><br/>" +
                    "<textarea class=\"profile-details-customernotes\" id=\"txtcustnotes\" maxlength=\"1000\" onkeyup=\"return chatSend.keyRestrict(this);\" placeholder=\"Add Notes\"></textarea>" +
                    "<a class=\"btn add btn-primary\" onclick=\"chatSend.SendCustNote()\">Add</a>";
        return data;
    }

    var channelData = function (c) {
        var cProfile = c.profile;
        var data = "";
        var custId = "";
        var mobno = "";
        var twrid = "";
        var emailid = "";
        var gender = "";
        var locale = "";

        if (cProfile != null) {
            data = "<label>Channel data</label><br/>";

            custId = cProfile.customerid;
            mobno = cProfile.mobileno;
            try { mobno = mobno.replace(/^\s*,+\s*|\s*,+\s*$/g, ''); } catch (e) { }
            if (mobno.indexOf(',') > -1) {
                var mobList = mobno.split(',');
                mobList = wmsutil.removeDuplicateArray(mobList);
                mobno = mobList;
                //for (i = 0; i < mobList.length; i++) {
                //    if (mobList[i].length > 0)
                //        mobno = mobno + mobList[i] + "<br/>";
                //}
            }
            else {
                mobno = cProfile.mobileno;
            }

            emailid = cProfile.emailid;
            try { emailid = emailid.replace(/^\s*,+\s*|\s*,+\s*$/g, ''); } catch (e) { }
            if (emailid.indexOf(',') > -1) {
                var eList = emailid.split(',');
                eList = wmsutil.removeDuplicateArray(eList);
                //for (i = 0; i < eList.length; i++) {
                //    if (eList[i].length > 0)
                //        emailid = emailid + eList[i] + "<br/>";
                //}
            }
            else {
                emailid = cProfile.emailid;
            }

            twrid = cProfile.twitterid;
            try { twrid = twrid.replace(/^\s*,+\s*|\s*,+\s*$/g, ''); } catch (e) { }
            if (twrid != "-NA-") {
                if (twrid.indexOf(',') > -1) {
                    var twList = twrid.split(',');
                    twList = wmsutil.removeDuplicateArray(twList);
                    twrid = twList;
                    //if (twList != null && twList != undefined) {
                    //    for (i = 0; i < twList.length; i++) {
                    //        if (twList[i].length > 0)
                    //            twrid = twrid + twList[i] + "<br/>";
                    //    }
                    //}
                }
                else {
                    twrid = cProfile.twitterid;
                }
            }


            gender = cProfile.gender;
            locale = cProfile.locale;

            if (mobno == "" || mobno == null)
                mobno = "-NA-";
            if (twrid == "" || twrid == null)
                twrid = "-NA-";
            if (emailid == "" || emailid == null)
                emailid = "-NA-";
            if (gender == "" || gender == null)
                gender = "-NA-";
            if (locale == "" || locale == null)
                locale = "-NA-";


            //  if (custId == "" || custId == undefined) {

            //    data += "<span class=\"left\" id=\"spnprof_mobileno\">Mobile</span><span class=\"right mightOverflow\" data-placement=\"top\" data-original-title=\"" + mobno + "\"  title=\"" + mobno + "\">" + mobno + "</span><br/>";

            if (emailid != "-NA-") {

                if (cProfile.emailid.indexOf(',') > -1) {
                    var eList = cProfile.emailid.split(',');
                    eList = wmsutil.removeDuplicateArray(eList);
                    //data += "<span class=\"left\" id=\"spnprof_emailid\">Email ID</span><br/>";
                    for (i = 0; i < eList.length; i++) {

                        if (eList[i] != "") {
                            eList[i] = datamask.checkgetdata("emailid", eList[i]);
                            if (i == 0) {
                                data += "<div class=\"panel panel-default\">" +
                                 "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" href=\"#collapseemail\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
                                "<span class=\"left\">Email ID</span><span class=\"middle\">:</span>" +
                                "<span class=\"right mightOverflow\" data-original-title=\"" + eList[i] + "\" data-placement=\"top\" id=\"spnprof_emailid" + i + "\" title=\"" + eList[i] + "\">" + eList[i] + "</span><br>" +
                             "</div>" +
                             "<div id=\"collapseemail\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\"> ";

                            }
                            else {
                                data += "<div class=\"consoledetailrow\"> <span class=\"left\">Email ID " + (i + 1) + " :</span>";
                                data += "<span class=\"right mightOverflow\" data-original-title=\"" + eList[i] + "\" data-placement=\"top\"  id=\"spnprof_emailid" + i + "\" title=\"" + eList[i] + "\">" + eList[i] + "</span></div>";

                            }
                            //data += "<label class=\"right mightOverflow\" id=\"spnprof_emailid" + i + "\" data-placement=\"top\" data-original-title=\"" + eList[i] + "\" title=\"Set as Default\" data-toggle=\"tooltip\"><input type=\"radio\" id=\"email_" + i + "\" name=\"rdbemailgroup\" /><span>" + eList[i] + "</span><i class=\"fa fa-check\"></i></label><br/>";
                        }

                    }
                    data += "</div></div>";
                } else {
                    emailid = datamask.checkgetdata("emailid", emailid);
                    // data += "<span class=\"left\" id=\"spnprof_emailid\">Email ID</span><span class=\"right mightOverflow\" data-placement=\"top\"  data-original-title=\"" + emailid + "\"  title=\"" + emailid + "\" data-toggle=\"tooltip\">" + emailid + "</span><br/>";
                    data += "<div class=\"panel panel-default\">" +
                   "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" href=\"#collapseemail\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
                  "<span class=\"left\">Email ID</span><span class=\"middle\">:</span>" +
                   "<span class=\"right mightOverflow\" data-original-title=\"" + emailid + "\" data-placement=\"top\"  id=\"spnprof_emailid\" title=\"" + emailid + "\">" + emailid + "</span><br>" +
             "</div><div id=\"collapseemail\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\"></div></div>";

                    //   "<span class=\"right mightOverflow\" data-original-title=\"-NA-\" data-placement=\"top\" data-toggle=\"tooltip\" id=\"spnprof_emailid\" title=\"\">ravivarma@gmail.com</span><br>" +
                    //"</div><div id=\"collapseemail\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\"></div></div>";
                }
            } else {
                emailid = datamask.checkgetdata("emailid", emailid);
                data += "<div class=\"panel panel-default\">" +
                 "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" href=\"#collapseemail\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
                "<span class=\"left\">Email ID</span><span class=\"middle\">:</span>" +
                "<span class=\"right mightOverflow\" data-original-title=\"" + emailid + "\" data-placement=\"top\"  id=\"spnprof_emailid\" title=\"" + emailid + "\">" + emailid + "</span><br>" +
             "</div><div id=\"collapseemail\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\"></div></div>";

            }



            if (mobno != "-NA-") {
                if (cProfile.mobileno.indexOf(',') > -1) {
                    var mobList = cProfile.mobileno.split(',');
                    mobList = wmsutil.removeDuplicateArray(mobList);
                    mobno = mobList;

                    for (i = 0; i < mobno.length; i++) {
                        if (mobno[i] != "") {
                            mobno[i] = datamask.checkgetdata("mobileno", mobno[i]);
                            if (i == 0) {
                                data += "<div class=\"panel panel-default\">" +
                                 "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" href=\"#collapsemobile\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
                                "<span class=\"left\">Mobile</span><span class=\"middle\">:</span>" +
                               "<span class=\"right mightOverflow\" data-original-title=\"" + mobno[i] + "\" data-placement=\"top\"  id=\"spnprof_mobileno" + i + "\" title=\"" + mobno[i] + "\">" + mobno[i] + "</span><br>" +

                             "</div>" +
                             "<div id=\"collapsemobile\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\"> ";

                            }
                            else {
                                data += " <div class=\"consoledetailrow\"><span class=\"left\">Mobile" + (i + 1) + "</span><span class=\"middle\">:</span>";
                                data += "<span class=\"right mightOverflow\" data-original-title=\"" + mobno[i] + "\" data-placement=\"top\" id=\"spnprof_mobileno" + i + "\" title=\"" + mobno[i] + "\">" + mobno[i] + "</span></div>";

                            }
                        }
                    }
                    data += "</div></div>";
                } else {
                    mobno = datamask.checkgetdata("mobileno", mobno);
                    data += "<div class=\"panel panel-default\">" +
                "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" href=\"#collapsemobile\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
               "<span class=\"left\">Mobile</span><span class=\"middle\">:</span>" +
               "<span class=\"right mightOverflow\" data-original-title=\"" + mobno + "\" data-placement=\"top\"  id=\"spnprof_emailid\" title=\"" + mobno + "\">" + mobno + "</span><br>" +
            "</div><div id=\"collapsemobile\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\"></div></div>";
                }
            } else {
                mobno = datamask.checkgetdata("mobileno", mobno);
                data += "<div class=\"panel panel-default\">" +
              "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" href=\"#collapsemobile\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
             "<span class=\"left\">Mobile</span><span class=\"middle\">:</span>" +
             "<span class=\"right mightOverflow\" data-original-title=\"" + mobno + "\" data-placement=\"top\"  id=\"spnprof_emailid\" title=\"" + mobno + "\">" + mobno + "</span><br>" +
          "</div><div id=\"collapsemobile\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\"></div></div>";
            }

            twrid = datamask.checkgetdata("twitterhandle", twrid);

            data += "<div class=\"panel panel-default\">" +
                  "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" href=\"#collapsetw\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
                   "<span class=\"left\">Twitter</span><span class=\"middle\">:</span>" +
                   "<span class=\"right mightOverflow\" data-original-title=\"" + twrid + "\" data-placement=\"top\"  id=\"divenduserhandle\" title=\"" + twrid + "\">" + twrid + "</span><br>" +
                  "</div>" +
                  "<div id=\"collapsetw\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\">" +
                  "</div>" +
                  "</div>";
            //data += "<div class=\"cheading\">Twitter</div>";
            //data += "<div class=\"left\">Twitter handle</div><div class=\"right\" id=\"divenduserhandle\">" + twrid + "</div><div class=\"clearfix\"></div>";
            var fbcustname = '';
            if (c.profile.facebookid != "" && c.profile.facebookid != null && c.profile.facebookid != undefined) {
                // $("#spnprof_fb").text(c.profile.customername);
                // fbcustname = datamask.checkgetdata("customername",c.profile.customername);
                fbcustname = datamask.checkgetdata("customername", c.profile.customername);
            } else {
                fbcustname = '-NA-';
            }
            gender = datamask.checkgetdata("gender", gender);
            locale = datamask.checkgetdata("locale", locale);
            data += "<div class=\"panel panel-default\">" +
                  "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" href=\"#collapsefb\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
                      "<span class=\"left\">Facebook</span><span class=\"middle\">:</span>" +
                      //"<span class=\"right mightOverflow\" data-original-title=\"-NA-\" data-placement=\"top\"  id=\"spnprof_fb\" title=\"\">-NA-</span><br>" +
                      "<span class=\"right mightOverflow\" data-original-title=\"-NA-\" data-placement=\"top\"  id=\"spnprof_fb\" title=\"\">" + fbcustname + "</span><br>" +
                  "</div>" +
                  "<div id=\"collapsefb\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\"> " +
                      "<div class=\"consoledetailrow\"><span class=\"left\">Gender</span><span class=\"middle\">:</span>" +
                      "<span class=\"right mightOverflow\" data-original-title=\"" + locale + "\" data-placement=\"top\"  id=\"spnprof_fbgender\" title=\"\">" + gender + "</span></div>" +
                      "<div class=\"consoledetailrow\"><span class=\"left\">Locale</span><span class=\"middle\">:</span>" +
                      "<span class=\"right mightOverflow\" data-original-title=\"" + locale + "\" data-placement=\"top\"  id=\"spnprof_fblocale\" title=\"" + locale + "\">" + locale + "</span></div>" +
                  "</div>" +
               "</div>";

            data += "<div class=\"panel panel-default\">" +
                  "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" href=\"#collapselc\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
                      "<span class=\"left\">Livehat</span><span class=\"middle\">:</span>" +
                      "<span class=\"right mightOverflow\" data-original-title=\"-NA-\" data-placement=\"top\"  id=\"spnprof_fb\" title=\"\"></span><br>" +
                     // "<span class=\"right mightOverflow\" data-original-title=\"-NA-\" data-placement=\"top\"  id=\"spnprof_fb\" title=\"\">" + fbcustname + "</span><br>" +
                  "</div>" +
                  "<div id=\"collapselc\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\"> " + custom_profile_params(c) +
                  "</div>" +
               "</div>";
        }
        return data;
    }

    var caseDetails = function (c) {
        var cCaseDetails = c.casedetails;
        var data = "";
        var format = "<div class=\"panel panel-default\">" +
                    "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"heading{0}\" data-toggle=\"collapse\" href=\"#{1}\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
                         "{2}  " +
                    "</div>" +
                    "<div id=\"{3}\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"heading{4}\"></div></div> ";
        if (cCaseDetails != null) {
            data = "<label>Other details</label><br/>";
            //data += "<div class=\"panel panel-default\">" +
            //        "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" href=\"#collapsecasedetails\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
            //             "<label>Case details</label>  " +
            //        "</div>" +
            //        "<div id=\"collapsecasedetails\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\"> ";

            if (c.info.channel == "3") {
                debugger;
                data = "<label>Other details</label><br/>";
                //data += "<div class=\"panel panel-default\">" +
                //    "<div class=\"panel-heading collapsed\" role=\"tab\" id=\"headingOne\" data-toggle=\"collapse\" href=\"#collapsecasedetails\" aria-expanded=\"true\" aria-controls=\"collapseOne\"> " +
                //         "<label>Chat details</label>  " +
                //    "</div>" +
                //    "<div id=\"collapsecasedetails\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\"> ";
                $.each(cCaseDetails, function (index, element) {
                    if (element.name != "servicekey" && element.name != "clientid" && element.name != "browserfingerprint" && element.name != "appid") {
                        var name = element.name;
                        if (element.name == "website") {
                            name = "Website";
                        }
                        if (element.name == "webpage") {
                            name = "Currently on";
                        }
                        if (element.name == "mobileno") {
                            name = "Mobile No";
                            element.val = datamask.checkgetdata("mobileno", element.val);
                        }
                        if (element.name == "emailid") {
                            name = "Email Id";
                            element.val = datamask.checkgetdata("emailid", element.val);
                        }
                        data += format.replace("{0}", name).replace("{1}", name).replace("{3}", name).replace("{4}", name).replace("{2}", "<span class=\"left\">" + name + "</span><span class=\"middle\">:</span>" +
                             "<span id=\"" + element.name + "\" class=\"right mightOverflow\" data-original-title=\"" + element.val + "\" data-placement=\"top\" data-toggle=\"tooltip\" title=\"" + element.val + "\">" + element.val + "</span><br>");
                    }
                });
            }
            else {
                $.each(cCaseDetails, function (index, element) {
                    // data += "<span class=\"left\">" + element.name + "</span><span class=\"right mightOverflow\" data-placement=\"top\"    data-original-title=\"" + element.val + "\"  title=\"" + element.val + "\">" + element.val + "</span><br/>";
                    data += format.replace("{0}", name).replace("{1}", name).replace("{3}", name).replace("{4}", name).replace("{2}", "<span class=\"left\">" + element.name + " </span><span class=\"middle\">:</span>" +
                         "<span class=\"right mightOverflow\" data-original-title=\"" + element.val + "\" data-placement=\"top\" data-toggle=\"tooltip\" title=\"" + element.val + "\">" + element.val + "</span><br>");

                });
            }
            data += "</div>" +
                    "</div>";
        }
        return data;
    }

    var custom_profile_params = function (c) {
        var custom_profile_params = c.custom_profile_params;
        var data = "";
        if (custom_profile_params != null) {
            if (c.info.channel == "3") {
                $.each(custom_profile_params, function (index, element) {
                    data += "<div class=\"consoledetailrow\"><span class=\"left\">" + element.name + "</span><span class=\"middle\">:</span>" +
                       "<span class=\"right mightOverflow\" data-original-title=\"" + element.val + "\" data-placement=\"top\"  id=\"spnprof_lcp" + element.name + "\" title=\"\">" + element.val + "</span></div>"
                });
            }
        }
        return data;
    }

    var elementItem = function (name, val) {
        return "<span class=\"left\">" + name + "</span><span class=\"right\">" + val + "</span><br/>";
    }
    var loadSearch = function (slist) {
        try {
            if (slist.length > 0) {
                //openWhiteOverlayPopup($("#historyResultsModal"));
                $("#historyResultsModal").modal('show');
                $("#historyResultsModalBody").html("<p class='noitems'>Please wait...</p>");
                setTimeout(function () {
                    $("#historyResultsModalBody").html("");
                    $.each(slist, function (s, p) {
                        loadchatIdResults(p);
                    });
                    $('span[data-toggle=\"tooltip\"]').tooltip();
                    wmsutil.nicescroll("#historyResultsModalBody");
                    $("#historyResultsModalBody").getNiceScroll().resize();
                }, 100);
                $('[data-toggle="tooltip"]').tooltip();
            }
            else {
                wss.alert('No conversations to display.');
                //$("#historyResultsModalBody").html("<p id=\"noitems\">No conversations to display.</p>");
            }
        }
        catch (e) { console.log("exception in loadSearch:" + e.message); }
    }
    var loadchatIdResults = function (p) {

        try {
            var convStatus = wmsutil.getChatStatus(p.status);
            // if (p.status == "1") { convStatus = "Active"; } else if (p.status == "2") { convStatus = "Archive"; } else if (p.status == "3") { convStatus = "Queue"; } else if (p.status == "4") { convStatus = "Close"; }

            var chatTmpl = "<div class=\"panel panel-default\"><div class=\"panel-heading\">";
            chatTmpl += " <h4 class=\"panel-title full-width\"><a onclick=\"chatProfile.BindChatData('" + p.chatid + "');\" class=\"accordion-toggle full-width\" data-toggle=\"collapse\" data-parent=\"#accordion\">";
            chatTmpl += "<div class=\"channellogocont\"><span class=\"iconch" + p.channel + "\"></span></div>";
            chatTmpl += "<div class=\"caseidcont\"><span class=\"left\">Customer Name:</span><span data-toggle=\"tooltip\" data-original-title=" + datamask.checkgetdata("customername", Encoder.htmlEncode(p.custname)) + " data-placement=\"top\">" + datamask.checkgetdata("customername", Encoder.htmlEncode(p.custname)) + "</span></div>";
            //chatTmpl += "<div class=\"useridcont\"><span class=\"lblchatid left\">CaseId:</span><span data-toggle=\"tooltip\" data-original-title=" + p.convid + " data-placement=\"top\">" + p.convid + "</span></div>";

            //chatTmpl += "<div class=\"useridcont\"><span class=\"left\" title=\"" + $("#teamcasename").val() + "\">" + $("#teamcasename").val() + "</span><span data-toggle=\"tooltip\" data-original-title=" + p.convid + " data-placement=\"top\">" + p.convid + "</span></div>";


            chatTmpl += "<div class=\"useridcont\"><span class=\"left\" data-toggle=\"tooltip\" data-original-title=\"" + $("#teamcasename").val() + "\" data-placement=\"top\">" + $("#teamcasename").val() + ":</span><span data-toggle=\"tooltip\" data-original-title=" + p.convid + " data-placement=\"top\">" + p.convid + "</span></div>";


            // chatTmpl += "<div class=\"dateidcont\"> <span class=\"left\">Status:</span> <span data-toggle=\"tooltip\" data-original-title=" + convStatus + " data-placement=\"top\"> " + convStatus + "</span></div>";

            chatTmpl += "<div class=\"dateidcont\"> <span class=\"left\">Status:</span> <span data-toggle=\"tooltip\" data-original-title=\"" + convStatus + "\" data-placement=\"top\"> " + convStatus + "</span></div>";

            //chatTmpl += "<span class=\"pull-right martop_15 marright_10\"><i id=\"arrow\" class=\"fa fa-angle-right\"></i></span><div class=\"clearfix\"></div> </a> <button id=\"" + p.chatid + "\" class=\"btnprint print\" onclick=\"PrintHistory('" + p.chatid + "','" + p.convid + "');\" style=\"display:none;\" ><i class=\"fa fa-print\"></i></button></h4> </div>";


            chatTmpl += "<span class=\"pull-right martop_15 marright_10\"><i id=\"arrow\" class=\"fa fa-angle-right\"></i></span><div class=\"clearfix\"></div> </a> <button id=\"" + p.chatid + "\" class=\"btnprint print\" onclick=\"PrintHistory('" + p.chatid + "','" + p.convid + "','" + p.channel + "','" + p.custname + "');\" style=\"display:none;\" ><i class=\"fa fa-print\"></i></button></h4> </div>";


            chatTmpl += " <div class=\"panel-collapse collapse\"><div class=\"panel-body chat-cont\" id=\"cht" + p.chatid + "\"></div></div> </div>";

            // wmsutil.replacetext();

            $("#historyResultsModalBody").append(chatTmpl);
        } catch (e) { console.log("exception in historyResultsModalBody:" + e.message); }
    }
    var appendChatConvBox = function (info, history) {
        try {
            if (history.msg != undefined) {
                if ($("#cht" + info.chatid).find("#ctrans" + history.historyid).length == 0) {
                    $("#cht" + info.chatid).append(chatTmpl.conversation(history, info.channel));
                    //$("#cht" + info.chatid).children().find('.chatconsoleletter').removeAttr('data-container')

                    $("#cht" + info.chatid).children().find('.chatconsoleletter').attr('data-container', $(this).attr('data-container').replace('body', 'chat-cont'));
                }
            }
        } catch (e) {
            console.log("exception in appendChatConvBox:" + e.message);
        }
    }
    return {
        setData: function (c) {
            bindProfileData(c);
        },
        EditName: function () {
            wmsutil.sendAnalytics("customer_details_name_edit");
            $("#spnprof_custname").hide();
            $("#aprof_custname").hide();

            $("#spnprof_edcustname").show();
            $("#txtprof_edcustname").val($("#spnprof_custname").text());
        },
        HideEditName: function () {

            $("#spnprof_custname").show();
            $("#aprof_custname").show();

            $("#spnprof_edcustname").hide();
            $("#txtprof_edcustname").val("");
        },
        UpdateName: function (custid) {

            if ($("#txtprof_edcustname").val() == "") {

                UIToastr('error', "Please enter name in customer profile.");
                return;
            }

            if (!ValidateAlphaNumericWithSpace($("#txtprof_edcustname").val())) {

                UIToastr('error', "Please enter chars and numeric with space only.");
                return;
            }

            totObj.profile.customername = $("#txtprof_edcustname").val();

            var ws = document.getElementById('txtHdnWorkspaceId').value;
            var postData = { customerid: custid, customername: $("#txtprof_edcustname").val() };
            $.ajax({
                type: "POST",
                url: wss.handlerurl() + 'Users_AgentAdmin.ashx?ws=' + ws + '&action=profile_updcustinfo',
                headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
                data: postData,
                async: true,
                success: function (msg) {
                    if (wmsutil.checkSession(msg) == false) {
                        wmsutil.sessionExpired(msg);
                        return;
                    }

                    var sessionExists = true;
                    //try {
                    //    if (msg.indexOf('SESSIONEXPIRED') == 0 || msg == "SESSION_EXPIRED") {
                    //        sessionExists = false;
                    //    }
                    //}
                    //catch (e) { }

                    if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                        var errormsg = msg.substring(6);
                        UIToastr('error', errormsg);
                        return;
                    }
                    else if (msg == "100") {
                        $("#spnprof_custname").html($("#txtprof_edcustname").val());
                        chatProfile.HideEditName();
                    }
                    else {
                        UIToastr('error', "Profile name updation failed.");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    try {
                        if (wmsutil.checkSession(thrownError) == false) {
                            wmsutil.sessionExpired(thrownError);
                            return;
                        }
                        wmsutil.ajaxfyexception();

                        wmsutil.customloader(0, 1000);
                    } catch (ee) { }
                }
            });
        },
        EditCustId: function () {
            wmsutil.sendAnalytics("customer_details_custid_edit");
            $("#spnprof_custid").hide();
            $("#aprof_custid").hide();

            $("#spnprof_edcustid").show();
            if ($("#spnprof_custid").text() != "[Customer Id]") {
                $("#txtprof_edcustid").val($("#spnprof_custid").text());

                // setTimeout(function () { GetCustomerIdSetting1(), 1000 });
            }
            else {
                $("#txtprof_edcustid").val("");
                // setTimeout(function () { GetCustomerIdSetting1(), 1000 });
            }
        },
        HideEditCustId: function () {
            $("#spnprof_custid").show();
            $("#aprof_custid").show();
            $("#spnprof_edcustid").hide();
            $("#txtprof_edcustid").val("");
        },
        Merge: function () {
            profileConflict.MergeProfile(totObj);
        },
        UpdateCustId: function (chatid) {
            if ($("#txtprof_edcustid").val() == "") {

                UIToastr('error', "Customer ID should not be empty");
                return;
            }
            if ($("#spnprof_custid").text().trim() == $("#txtprof_edcustid").val().trim()) {
                UIToastr('error', "You have entered same existing customer id.Please provide other customer id or click on cancel button.");
                return;
            }

            //            if (!ValidateAlphaNumeric($("#txtprof_edcustid").val())) {

            //                UIToastr('error', "Please enter chars and numeric only.");
            //                return;
            //            }

            totObj.profile.customerid = $("#txtprof_edcustid").val();

            var ws = document.getElementById('txtHdnWorkspaceId').value;
            var postData = { chatid: chatid, customerid: $("#txtprof_edcustid").val() };
            $.ajax({
                type: "POST",
                url: wss.handlerurl() + 'Users_AgentAdmin.ashx?ws=' + ws + '&action=profile_inscustid',
                headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
                data: postData,
                async: true,
                success: function (msg) {
                    if (wmsutil.checkSession(msg) == false) {
                        wmsutil.sessionExpired(msg);
                        return;
                    }
                    var sessionExists = true;
                    //try {
                    //    if (msg.indexOf('SESSIONEXPIRED') == 0 || msg == "SESSION_EXPIRED") {
                    //        sessionExists = false;
                    //    }
                    //}
                    //catch (e) { }

                    if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                        var errormsg = msg.substring(6);
                        UIToastr('error', errormsg);
                        return;
                    }
                    else if (msg != "") {
                        if (msg == 101) {
                            profileConflict.LoadConflictProfile(totObj);
                        }
                        else if (msg == -100) {
                            UIToastr('error', "Customer Id updation failed");
                        }
                        else if (msg == 100) {
                            $("#spnprof_custid").html($("#txtprof_edcustid").val());
                            $("#spnprof_custid").show();
                            $("#aprof_custid").hide();
                            $("#spnprof_edcustid").hide();
                            $("#txtprof_edcustid").val("");

                            chatProfile.setData(totObj);


                            if (totObj.defaultid != null && totObj.defaultid.length > 0) {
                                for (var i = 0; i < totObj.defaultid.length; i++) {
                                    $("input:radio[name=rdbmobgroup]").each(function (ind, elm) {
                                        var mobno = $("#spnprof_mobileno" + ind).text();
                                        if (mobno == totObj.defaultid[i].custid) {
                                            $("#mob" + ind).prop("checked", true);
                                            $("#spnprof_mobileno" + ind).tooltip('disable');
                                        }

                                    });

                                    $("input:radio[name=rdbemailgroup]").each(function (ind, elm) {
                                        var emailtxt = $("#spnprof_emailid" + ind).text();
                                        if (emailtxt == totObj.defaultid[i].custid) {
                                            $("#email" + ind).prop("checked", true);
                                            $("#spnprof_emailid" + ind).tooltip('disable');
                                        }
                                    });
                                }
                            }
                            IMIchat.rdbmobgroupchange();
                            IMIchat.rdbemailgroup();


                        }
                    }
                    else {
                        UIToastr('error', "Customer Id updation falied.");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    try {
                        if (wmsutil.checkSession(thrownError) == false) {
                            wmsutil.sessionExpired(thrownError);
                            return;
                        }
                        wmsutil.customloader(0, 0);
                    } catch (ee) { }
                }
            });
        },
        DNDUser: function (cid) {
            wmsutil.sendAnalytics("customer_details_dnd_list");
            var title = "Add customer to the Do-Not-Disturb list?";
            var body = "Are you sure you want to add this customer to the Do-Not-Disturb list? Once added, you will not be able to send any messages to this customer.";
            try {
                $("#btnUpdateClose").removeAttr("disabled");
                $("#btnUpdateStatus").removeAttr("disabled");
            } catch (ex) { }
            $("#modalUpdateLabel").html(title);
            $("#modalUpdateBody").html("<p>" + body + "</p>");
            $("#btnUpdateClose").text("No");
            $("#btnUpdateStatus").show();
            $("#btnUpdateStatus").removeClass("processing");
            $("#btnUpdateStatus").attr("onclick", "chatProfile.DNDUserCall('" + cid + "')");
            $("#modalUpdateStatus").modal('show');

        },
        DNDUserCall: function (cid) {
            var ws = document.getElementById('txtHdnWorkspaceId').value;
            var postData = { chatid: cid };
            $.ajax({
                type: "POST",
                url: wss.handlerurl() + 'Users_AgentAdmin.ashx?ws=' + ws + '&action=profile_insdnduser',
                headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
                data: postData,
                async: true,
                success: function (msg) {
                    if (wmsutil.checkSession(msg) == false) {
                        wmsutil.sessionExpired(msg);
                        return;
                    }
                    $("#modalUpdateStatus").modal('hide');
                    var sessionExists = true;
                    //try {
                    //    if (msg.indexOf('SESSIONEXPIRED') == 0 || msg == "SESSION_EXPIRED") {
                    //        sessionExists = false;
                    //    }
                    //}
                    //catch (e) { }

                    if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                        var errormsg = msg.substring(6);
                        UIToastr('error', errormsg);
                        return;
                    }
                    else if (msg != "") {
                        if (msg == -100) {
                            UIToastr('error', "Customer adding into DND list failed.");
                        }
                        else if (msg == 100) {
                            UIToastr('success', "Customer added into DND list.");
                            $("#aprof_dnd").removeAttr("onclick");
                            $("#aprof_dnd").prop("class", "blkbtn active");
                            $("#aprof_dnd").removeAttr("data-original-title");
                            $("#aprof_dnd").prop("data-original-title", "Customer exist in 'Do-not-disturb' list");
                        }
                    }
                    else {
                        UIToastr('error', "Customer added into DND list falied.");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    try {
                        if (wmsutil.checkSession(thrownError) == false) {
                            wmsutil.sessionExpired(thrownError);
                            return;
                        }
                        wmsutil.ajaxfyexception();

                        wmsutil.customloader(0, 1000);
                    } catch (ee) { }
                }
            });

        },
        Viewhistory: function (chtid) {
            wmsutil.sendAnalytics("customer_details_cust_chat_history_cust_chat_history_toggle");
            $('[data-toggle="tooltip"]').tooltip();
            var ws = document.getElementById('txtHdnWorkspaceId').value;
            var postData = { chatid: chtid, action: "chat_gethistory", ws: document.getElementById('txtHdnWorkspaceId').value };
            $.ajax({
                type: "POST",
                url: wss.handlerurl() + 'Users_AgentAdmin.ashx?ws=' + ws,
                headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
                data: postData,
                async: true,
                success: function (msg) {
                    if (wmsutil.checkSession(msg) == false) {
                        wmsutil.sessionExpired(msg);
                        return;
                    }
                    var sessionExists = true;
                    //try {
                    //    if (msg.indexOf('SESSIONEXPIRED') == 0 || msg == "SESSION_EXPIRED") {
                    //        sessionExists = false;
                    //    }
                    //}
                    //catch (e) { }

                    if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                        var errormsg = msg.substring(6);
                        UIToastr('error', errormsg);
                        return;
                    }
                    else if (msg != "") {
                        var results = Results(msg);
                        if (results.code == "0") {
                            loadSearch(results.Search);
                            $('[data-toggle="tooltip"]').tooltip();
                        }
                        else {
                            wss.alert('No conversations to display.');
                            //$("#historyResultsModalBody").html("<p class='noitems'>No conversations to display.</p>");
                        }
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    try {
                        if (wmsutil.checkSession(thrownError) == false) {
                            wmsutil.sessionExpired(thrownError);
                            return;
                        }
                        wmsutil.ajaxfyexception();

                        wmsutil.customloader(0, 1000);
                    } catch (ee) { }
                }
            });
        },
        Editmobilno: function () {
            $("#spnprof_mobileno").hide();
            $("#aprof_mobileno").hide();

            $("#spnprof_edmobileno").show();
            if ($("#spnprof_mobileno").text() == "-NA-")
                $("#txtprof_edmobileno").val("");
            else
                $("#txtprof_edmobileno").val($("#spnprof_mobileno").text());
        },
        HideEditMobileno: function () {
            $("#spnprof_mobileno").show();
            $("#aprof_mobileno").show();

            $("#spnprof_edmobileno").hide();
            $("#txtprof_edmobileno").val("");
        },
        UpdateMobileNo: function () {
            if ($("#txtprof_edmobileno").val() == "") {

                UIToastr('error', "Please enter mobile no in customer profile.");
                return;
            }

            if (!ValidateNumeric($("#txtprof_edmobileno").val())) {

                UIToastr('error', "Please enter numeric only.");
                return;
            }
            var custid = $("#spnprof_custid").text();
            var ws = document.getElementById('txtHdnWorkspaceId').value;
            var postData = { customerid: custid, mobileno: $("#txtprof_edmobileno").val() };
            $.ajax({
                type: "POST",
                url: wss.handlerurl() + 'Users_AgentAdmin.ashx?ws=' + ws + '&action=profile_updcustinfo',
                headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
                data: postData,
                async: true,
                success: function (msg) {
                    if (wmsutil.checkSession(msg) == false) {
                        wmsutil.sessionExpired(msg);
                        return;
                    }
                    var sessionExists = true;
                    //try {
                    //    if (msg.indexOf('SESSIONEXPIRED') == 0 || msg == "SESSION_EXPIRED") {
                    //        sessionExists = false;
                    //    }
                    //}
                    //catch (e) { }

                    if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                        var errormsg = msg.substring(6);
                        UIToastr('error', errormsg);
                        return;
                    }
                    else if (msg == "100") {
                        $("#spnprof_mobileno").html($("#txtprof_edmobileno").val());
                        $("#spnprof_mobileno").attr("data-original-title", $("#txtprof_edmobileno").val());
                        chatProfile.HideEditMobileno();
                    }
                    else {
                        UIToastr('error', "MobileNumber updation failed.");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    try {
                        if (wmsutil.checkSession(thrownError) == false) {
                            wmsutil.sessionExpired(thrownError);
                            return;
                        }
                        wmsutil.ajaxfyexception();

                        wmsutil.customloader(0, 1000);
                    } catch (ee) { }
                }
            });
        },
        EdittwitterId: function () {
            $("#spnprof_twitterid").hide();
            $("#aprof_twitterid").hide();

            $("#spnprof_edtwitterid").show();
            if ($("#spnprof_twitterid").text() == "-NA-")
                $("#txtprof_edtwitterid").val("");
            else
                $("#txtprof_edtwitterid").val($("#spnprof_twitterid").text());
        },
        HideEditTwitterId: function () {
            $("#spnprof_twitterid").show();
            $("#aprof_twitterid").show();

            $("#spnprof_edtwitterid").hide();
            $("#txtprof_edtwitterid").val("");
        },
        UpdateTwitterId: function () {

            if ($("#txtprof_edtwitterid").val() == "") {

                UIToastr('error', "Please enter twitter id in customer profile.");
                return;
            }

            var custid = $("#spnprof_custid").text();
            var ws = document.getElementById('txtHdnWorkspaceId').value;
            var postData = { customerid: custid, twitterid: $("#txtprof_edtwitterid").val() };
            $.ajax({
                type: "POST",
                url: wss.handlerurl() + '/Users_AgentAdmin.ashx?ws=' + ws + '&action=profile_updcustinfo',
                headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
                data: postData,
                async: true,
                success: function (msg) {
                    if (wmsutil.checkSession(msg) == false) {
                        wmsutil.sessionExpired(msg);
                        return;
                    }
                    var sessionExists = true;
                    //try {
                    //    if (msg.indexOf('SESSIONEXPIRED') == 0 || msg == "SESSION_EXPIRED") {
                    //        sessionExists = false;
                    //    }
                    //}
                    //catch (e) { }

                    if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                        var errormsg = msg.substring(6);
                        UIToastr('error', errormsg);
                        return;
                    }
                    else if (msg == "100") {
                        $("#spnprof_twitterid").html($("#txtprof_edtwitterid").val());
                        $("#spnprof_twitterid").attr("data-original-title", $("#txtprof_edtwitterid").val());
                        chatProfile.HideEditTwitterId();
                    }
                    else {
                        UIToastr('error', "Twitter handle updation failed.");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    try {
                        if (wmsutil.checkSession(thrownError) == false) {
                            wmsutil.sessionExpired(thrownError);
                            return;
                        }
                        wmsutil.ajaxfyexception();

                        wmsutil.customloader(0, 1000);
                    } catch (ee) { }
                }
            });

        },
        EditEmail: function () {
            $("#spnprof_emailid").hide();
            $("#aprof_emailid").hide();

            $("#spnprof_edemailid").show();
            if ($("#spnprof_emailid").text() == "-NA-") {
                $("#txtprof_edemailid").val("");
            }
            else {
                $("#txtprof_edemailid").val($("#spnprof_emailid").text());
            }
        },
        HideEditEmailId: function () {
            $("#spnprof_emailid").show();
            $("#aprof_emailid").show();

            $("#spnprof_edemailid").hide();
            $("#txtprof_edemailid").val("");
        },
        UpdateEmailId: function () {

            if ($("#txtprof_edemailid").val() == "") {

                UIToastr('error', "Please enter email id in customer profile.");
                return;
            }

            if (!ValidateEmailId($.trim($("#txtprof_edemailid").val()))) {
                UIToastr('error', "Please enter valid emailid.");
                return false;
            }

            var custid = $("#spnprof_custid").text();
            var ws = document.getElementById('txtHdnWorkspaceId').value;
            var postData = { customerid: custid, emailid: $("#txtprof_edemailid").val() };
            $.ajax({
                type: "POST",
                url: wss.handlerurl() + 'Users_AgentAdmin.ashx?ws=' + ws + '&action=profile_updcustinfo',
                headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
                data: postData,
                async: true,
                success: function (msg) {
                    if (wmsutil.checkSession(msg) == false) {
                        wmsutil.sessionExpired(msg);
                        return;
                    }
                    var sessionExists = true;
                    //try {
                    //    if (msg.indexOf('SESSIONEXPIRED') == 0 || msg == "SESSION_EXPIRED") {
                    //        sessionExists = false;
                    //    }
                    //}
                    //catch (e) { }

                    if (msg.indexOf('Error') >= 0 || msg.indexOf('ERROR') >= 0) {
                        var errormsg = msg.substring(6);
                        UIToastr('error', errormsg);
                        return;
                    }
                    else if (msg == "100") {
                        $("#spnprof_emailid").html($("#txtprof_edemailid").val());
                        $("#spnprof_emailid").attr("data-original-title", $("#txtprof_edemailid").val());
                        chatProfile.HideEditEmailId();
                    }
                    else {
                        UIToastr('error', "EmailId updation failed.");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    try {
                        if (wmsutil.checkSession(thrownError) == false) {
                            wmsutil.sessionExpired(thrownError);
                            return;
                        }
                        wmsutil.ajaxfyexception();

                        wmsutil.customloader(0, 1000);
                    } catch (ee) { }
                }
            });

        },

        BindChatData: function (cid) {


            //            if ($('#hdnenableprint').val() == "0") {
            //                $("#" + cid + ".btnprint").css("display", "none");
            //            } else {
            //                //  $(".btnprint").css("display", "inline");
            //                $("#" + cid + ".btnprint").css("display", "inline");
            //            }
            wmsutil.sendAnalytics("customer_details_cust_chat_history_cust_chat_history_expand");
            if ($("#cht" + cid).html().length > 0) {

                if ($("#cht" + cid).parent('.panel-collapse').hasClass('in')) {
                    $("#" + cid).css("display", "none");
                    $("#cht" + cid).parent('.panel-collapse').removeClass('in');
                    $("#historyResultsModalBody .panel-heading button").css("display", "none");

                    wmsutil.nicescroll("#historyResultsModalBody");
                    $("#historyResultsModalBody").getNiceScroll().resize();
                    $("#cht" + cid).parent('.panel-collapse').parent('.panel-default').find('#arrow').removeClass('fa fa-angle-down').addClass('fa fa-angle-right');
                    return;
                } else {
                    $("#cht" + cid).addClass('in');

                    $("#historyResultsModalBody .panel-collapse").removeClass('in');
                    $("#historyResultsModalBody .panel-heading button").css("display", "none");


                    $("#historyResultsModalBody .panel-collapse").parent('.panel-default').find('#arrow').removeClass('fa fa-angle-down').addClass('fa fa-angle-right');
                    $("#cht" + cid).parent('.panel-collapse').addClass('in');
                    $("#" + cid).css("display", "inline");
                    wmsutil.nicescroll("#historyResultsModalBody");
                    $("#historyResultsModalBody").getNiceScroll().resize();
                    $("#cht" + cid).parent('.panel-collapse').parent('.panel-default').find('#arrow').removeClass('fa fa-angle-right').addClass('fa fa-angle-down');
                    return;
                }
            }
            try {
                var ws = document.getElementById('txtHdnWorkspaceId').value;
                var postdata = "action=chat_searchchat&ws=" + ws + "&chatid=" + cid;
                $.ajax({
                    type: "POST",
                    headers: { 'SESSTOKEN': $("#sesstoken").val(), 'RTN': wmsutil.getGUID() },
                    url: wss.handlerurl() + "Users_AgentAdmin.ashx",
                    data: postdata,
                    async: true,
                    success: function (msg) {
                        if (wmsutil.checkSession(msg) == false) {
                            wmsutil.sessionExpired(msg);
                            return;
                        }
                        var sessionExists = true;
                        //try {
                        //    if (msg.indexOf('SESSIONEXPIRED') == 0 || msg == "SESSION_EXPIRED") {
                        //        sessionExists = false;
                        //    }
                        //}
                        //catch (e) { }


                        var results = Results(msg);
                        var bindHtml = "";
                        if (results.code == "0") {
                            if (results.history != null || results.history == "") {
                                for (var i = 0; i < results.history.length; i++) {
                                    appendChatConvBox(results.info, results.history[i]);
                                }
                                $("#historyResultsModalBody .panel-collapse").removeClass('in');
                                $("#historyResultsModalBody .panel-heading button").css("display", "none");
                                $("#cht" + cid).parent('.panel-collapse').addClass('in');
                                $("#" + cid).css("display", "inline");
                                $("#cht" + cid).parent('.panel-collapse');
                                $("#cht" + cid).parent('.panel-collapse').parent('.panel-default').find('#arrow').removeClass('fa fa-angle-right').addClass('fa fa-angle-down');

                                wmsutil.nicescroll("#historyResultsModalBody");
                                $("#historyResultsModalBody").getNiceScroll().resize();
                            }
                            else {
                                $("#cht" + cid).html("<p class='noitems'>No conversations to display.</p>");
                                $("#historyResultsModalBody .panel-collapse").removeClass('in');
                                $("#historyResultsModalBody .panel-heading button").css("display", "none");
                                $("#" + cid).css("display", "inline");
                                $("#cht" + cid).parent('.panel-collapse').addClass('in');
                                $("#cht" + cid).parent('.panel-collapse').parent('.panel-default').find('#arrow').removeClass('fa fa-angle-right').addClass('fa fa-angle-down');

                                wmsutil.nicescroll("#historyResultsModalBody");
                                $("#historyResultsModalBody").getNiceScroll().resize();
                            }
                            $('[data-toggle="tooltip"]').tooltip();
                        } else {
                            $("#historyResultsModalBody").html("<p class='noitems'>No conversations to display.</p>");
                        }
                    },
                    error: function (xhr, err, thrownError) {
                        try {
                            if (wmsutil.checkSession(thrownError) == false) {
                                wmsutil.sessionExpired(thrownError);
                                return;
                            }
                            wmsutil.ajaxfyexception();

                            wmsutil.customloader(0, 1000);
                        } catch (ee) { }
                        console.log("error in searchKey:" + err);
                    }
                });
            }
            catch (e) {
                console.log("exception in bindChatdata:" + e.message);
            }
        },
        setMetaData: function (c) {
            caseDetails(c);
        },
    }
}(jQuery);

function Results(msg) {
    var r = { code: "", newconv: "0", transtime: "", Current: {}, History: [], Queue: [], Assigned: [], CurrentChat: [], TmplList: {}, TmplGroup: [], Alerts: [] };
    try { r = $.parseJSON(msg); } catch (ex) { }
    return r;
}


function PrintHistory(id, caseid, channel, custname) {

    channel = wmsutil.getChannelName(channel);
    var customcaseid = '';
    if ($(".lblchatid").text() != "") {
        customcaseid = $(".lblchatid").text();
    }
    else {
        customcaseid = "CaseId";
    }


    // $("iframe").contents().find("body").html('');
    var contents = '';
    contents = $("#cht" + id).parent('.panel-collapse').html();

    //contents = $("#historyResultsModalBody").html();
    var frame1 = $('<iframe />');
    frame1[0].name = "frame1";
    frame1.css({ "position": "", "top": "-1000000px" });
    $("body").append(frame1);
    var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
    frameDoc.document.open();

    //Create a new HTML document.
    frameDoc.document.write('<html><head><title></title>');

    //Append the external CSS file.
    frameDoc.document.write('<link href=\"imichat/css/printcss.css?t=v28\" rel=\"stylesheet\" type=\"text/css\" />');
    //frameDoc.document.write('<style type=\"text/css\"> #historyResultsModalBody{ width:800px; max-width:950px; margin-left:150px; max-height:auto; overflow: auto; outline: none;} </style>');

    frameDoc.document.write('<style type=\"text/css\"> .panel-collapse{width:96%;} </style>');
    frameDoc.document.write('</head><body>');



    //Append the DIV contents.

    //frameDoc.document.write('<div class="panel-heading"><h1>CaseId: ' + caseid + '</h1></div>');

    frameDoc.document.write('<div><div style="margin:5px;float:left;"><b>Channel: </b>' + channel + ' </div><div style="margin:5px;float:left;"><b>Customer Name: </b>' + datamask.checkgetdata("customername", custname) + ' </div><div style="margin:5px;float:left;"><b>' + customcaseid + ':</b> ' + caseid + '</div></div>');

    frameDoc.document.write('<div class="panel-collapse collapse in">' + contents + '</div>');

    frameDoc.document.write("<script> var divHeight = document.getElementById('historyResultsModalBody').scrollHeight;");
    frameDoc.document.write("try { document.getElementById('historyResultsModalBody').style.height = divHeight + 'px!important' } catch (e) { alert(e.message); };");
    frameDoc.document.write(" document.getElementsByTagName('body').style.height = divHeight + 'px!important';");



    //  frameDoc.document.write(" alert(document.getElementsByTagName('body').style.height);");
    frameDoc.document.write("</script>");
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        frame1.remove();
    }, 500);



}









