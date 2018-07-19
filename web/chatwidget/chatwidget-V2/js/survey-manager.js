var _survey_fields;
var _active_field;
var _is_active_field_conditional = false;
var _survey_fields_data = [];
var _current_field_index = 0;

var _option_snippet = '<option value="{0}">{1}</option>';

var _pre_survey_exp_details = '<div class="chat_message_wrapper chat_message_left" id="">' +
    '<ul class="chat_message">' +
    '<li class="agentimage"><img src="/chatwidget-V2/images/cub-vid-img.jpg"></li>' +
    '<li class="mocolor" style="background: {0}">' +
    '<p>Hi! there, We need few details to serve you better. Please fill the following.</p>' +
    '</li>' +
    '</ul>' +
    '</div>';

var _post_survey_exp_details = '<span class="chat_message_time"><span class="text">Received</span>{0}</span>';

var _survey_body_snippet = '<div class="chat_message_wrapper chat_message_left prechat-form" id="dvChatSurvey">' +
    '<ul id="ulSurveyFields" class="chat_message">' +
    '<li class="agentimage"><img src="/chatwidget-V2/images/cub-vid-img.jpg"></li>' +
    '<li id="liSurveyFields" class="mocolor" style="background: {0}">' +
    '</li>' +
    '</ul>' +
    '</div>';

var _survey_previw_text_snippet =
    ' <div class="feild-div">' +
    '<span class="supporttxt-abovetxtbox">{0}{6}</span>' +
    '<input type="text" data-id="{1}" title="{2}" class="form-feild" data-field-index="{3}" data-conditional="{4}" maxlength="30">' +
    '<span class="input-group-btn">' +
    '<button class="btn btn-togo" type="button" data-id="{1}" style="background-color: {5};color:{7}"><i class="icon-send-button"></i></button>' +
    '</span>' +
    '<div class="clearfix"></div>' +
    '<span data-id="{1}" class="error-txtbox" style="display:none;">Please provide value</span>' +
    '</div>';

var _survey_previw_dropdown_snippet =
    ' <div class="feild-div">' +
    '<span class="supporttxt-abovetxtbox">{0}{7}</span>' +
    '<select class="form-feild" data-id="{1}" title="{2}" data-field-index="{3}" data-conditional="{4}">' +
    '<option value="">--Select--</option>' +
    '{5}' +
    '</select>' +
    '<span class="input-group-btn">' +
    '<button class="btn btn-togo" type="button" data-id="{1}" style="background-color: {6};color:{8}"><i class="icon-send-button"></i></button>' +
    '</span>' +
    '<div class="clearfix"></div>' +
    '<span data-id="{1}" class="error-txtbox" style="display:none;">Please provide value</span>' +
    '</div>';

function startPrechatSurvey() {
    _survey_fields_data = [];
    _current_field_index = 0;
    _is_active_field_conditional = false;

    _survey_fields = JSON.parse(localStorage.getItem("style_" + IMIGeneral.getDomain())).survey_fields;

    if (_survey_fields.length > 0) {
        $('#chat_submit_box').hide();
        $('#chat').css('height', 'calc(100% - {0}px)'.format(120));

        _active_field = _survey_fields[0];
        $('#icwdivcarea').append(_pre_survey_exp_details.format(mocolor));
        $('#icwdivcarea').append(_survey_body_snippet.format(mocolor));
        processSurveyField(_active_field);
    }
}

function updatePrechatSurvey(callback) {
    var update_survey_api_url = '{0}profile/survey/{1}/{2}/{3}'.format(IMIGeneral.profileUrl(), IMILiveChat.appId(),
        localStorage.getItem("browserfingerprint"), IMILiveChat.getCurrentThreadId());
    console.log(update_survey_api_url);
    $.ajax({
        url: update_survey_api_url,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(_survey_fields_data),
        async: true,
        success: function (data) {
            callback(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Error: " + errorThrown);
        }
    });
}

function processSurveyField(field, field_index, is_conditional) {
    var snippet = '';
    var input_control;
    if (field.field_type === 1) {
        var field_value_option_snippet = '';
        $.each(field.options, function (index, option) {
            field_value_option_snippet += _option_snippet.format(option.value, option.name);
        });
        snippet = _survey_previw_dropdown_snippet.format(field.name, field.id,
            field.description, field_index, is_conditional, field_value_option_snippet, mtcolor,
            field.is_mandatory ? '<span>*</span>' : '',PreChatIconColor);

        $('#liSurveyFields').append(snippet);
        input_control = $('select[data-id="{0}"]'.format(field.id));

        input_control.focus();
    } else {
        snippet = _survey_previw_text_snippet.format(field.name, field.id, field.description, field_index, is_conditional, mtcolor,
            field.is_mandatory ? '<span>*</span>' : '',PreChatIconColor);
        $('#liSurveyFields').append(snippet);
        input_control = $('input:text[data-id="{0}"]'.format(field.id));

        if (field.field_type !== 6) {
            input_control.focus();
        }
    }

    input_control.on('focus', function (e) {
        $('span[data-id="{0}"]'.format(_active_field.id)).hide();
        $('input:text[data-id="{0}"]'.format(_active_field.id)).css('border', '');
    });

    $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);

    input_control.on('keydown', function (e) {
        var charCode = (e.which) ? e.which : e.keyCode
        if (charCode == 13 || charCode == 9) {
            if (charCode == 9) {
                e.preventDefault();
                e.stopPropagation();
            }
            $('button[data-id="{0}"]'.format(_active_field.id)).click();
        }
    });

    switch (field.field_type) {
        case 2:
        case 7:
            input_control.on('keyup blur', function (e) {
                if (this.value.match(/[^0-9a-zA-Z ]/g)) {
                    this.value = this.value.replace(/[^0-9a-zA-Z ]/g, '');
                }
            });
            break;
        case 4:
        case 5:
            input_control.attr('maxlength', 5);
            input_control.keypress(function (event) {
                return isReal(event, this, _active_field.field_type === 4);
            });
            break;
        case 6:
            input_control.datepicker({
                format: "M/dd/yyyy",
                pickTime: false,
                autoclose: true
            }).on('changeDate', function (e) {
                $(this).focus();
            });
            input_control.keypress(function (event) {
                return false;
            });
            break;
    }

    input_control.change(function () {
        var input_val = _active_field.field_type === 1 ?
            $(this).find('option:selected').val() :
            $(this).val();

        var field_data = _survey_fields_data.filter(function (data_item) {
            return data_item.id === _active_field.id;
        })[0];

        if (field_data !== undefined) {
            field_data.value = input_val;
        } else {
            _survey_fields_data.push({
                name: _active_field.name,
                id: _active_field.id,
                is_conditional: _is_active_field_conditional,
                field_type: _active_field.field_type,
                is_profile_type: _active_field.is_profile_type,
                value: input_val
            });
        }
    });

    $('button[data-id="{0}"]'.format(field.id)).click(function () {
        var button = $(this);

        var input_control = _active_field.field_type === 1 ?
            $('select[data-id="{0}"]'.format(_active_field.id)) :
            $('input:text[data-id="{0}"]'.format(_active_field.id));

        var input_val = _active_field.field_type === 1 ?
            input_control.find('option:selected').val() :
            input_control.val();

        var alert_control = $('span[data-id="{0}"]'.format(_active_field.id));
        if (_active_field.is_mandatory && input_val === '') {
            alert_control.text('Please provide value');
            $('input:text[data-id="{0}"]'.format(_active_field.id)).css('border', '1px solid #ff6c6c');
            alert_control.show();
            return;
        } else {
            if (_active_field.field_type === 3 && !ValidateEmailId(input_val)) {
                $('input:text[data-id="{0}"]'.format(_active_field.id)).css('border', '1px solid #ff6c6c');
                alert_control.text('Please provide valid email id');
                alert_control.show();
                return;
            }

            $('input:text[data-id="{0}"]'.format(_active_field.id)).css('border', '');
            alert_control.hide();
        }

        $(this).prop('disabled', true);
        $(this).find('i').removeClass('icon-send-button');
        $(this).find('i').addClass('icon-tickicon');
        input_control.prop('disabled', true);

        $(this).addClass('disable');
        input_control.addClass('disable');

        var show_conditional_field = false;
        if (_active_field.conditional_field != null) {
            switch (_active_field.operator) {
                case 1:
                    show_conditional_field = convert(input_val) === convert(_active_field.value);
                    break;
                case 2:
                    show_conditional_field = convert(input_val) !== convert(_active_field.value);
                    break;
                case 3:
                    show_conditional_field = convert(input_val) < convert(_active_field.value);
                    break;
                case 4:
                    show_conditional_field = convert(input_val) <= convert(_active_field.value);
                    break;
                case 5:
                    show_conditional_field = convert(input_val) > convert(_active_field.value);
                    break;
                case 6:
                    show_conditional_field = convert(input_val) >= convert(_active_field.value);
                    break;
            }
        }

        if (show_conditional_field) {
            _active_field = _active_field.conditional_field;
            _is_active_field_conditional = true;
            processSurveyField(_active_field, _current_field_index, true);
        } else {
            _is_active_field_conditional = false;
            if (_current_field_index === _survey_fields.length - 1) {
                console.log(_survey_fields_data);
                updatePrechatSurvey(function (data) {
                    if (data !== null) {
                        /*if (data.is_conditional) {
                            _active_field = _survey_fields.filter(function (field, index) {
                                if (field.conditional_field.id === data.id) {
                                    _current_field_index = index;
                                    return true;
                                }
                                return false;
                            })[0].conditional_field;
                        } else {
                            _active_field = _survey_fields.filter(function (field, index) {
                                if (field.id === data.id) {
                                    _current_field_index = index;
                                    return true;
                                }
                                return false;
                            })[0];
                        }

                        _survey_fields_data = [];
                        _is_active_field_conditional = data.is_conditional;
                        processSurveyField(_active_field, _current_field_index, _is_active_field_conditional)*/
                        console.error('Data update failed.');
                        console.log(data);
                    } else {
                        localStorage.setItem('is-first-mo-sent-{0}'.format(IMILiveChat.getCurrentThreadId()), 1);
                        $('#chat').css('height', 'calc(100% - {0}px)'.format(180));
                        $('#chat_submit_box').show();
                    }
                    $('#ulSurveyFields').append(_post_survey_exp_details.format(IMIGeneral.getUserTimezoneDateTime(IMIGeneral.getCurrentUTCtime())));
                });

                localStorage.setItem('prechat_survey_data', JSON.stringify(_survey_fields_data));
                return;
            }
            _current_field_index++;
            _active_field = _survey_fields[_current_field_index];
            processSurveyField(_active_field, _current_field_index, false);
        }
    });
}

function convert(value) {
    if ([1, 2, 3, 7].indexOf(_active_field.field_type) >= 0) {
        return value.toLowerCase();
    }
    if (_active_field.field_type === 6) {
        return Number(new Date(value))
    }
    return Number(value)
}

String.prototype.format = function () {
    var input_string = this;
    $.each(arguments, function (index, param) {
        var place_holder = '{' + index + '}'
        input_string = input_string.split(place_holder).join(param);
    });
    return input_string;
}

function isReal(evt, element, is_int_only) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (
        (is_int_only || (charCode != 46 || $(element).val().indexOf('.') != -1)) &&
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function ValidateEmailId(val) {
    try {
        var pattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!val.match(pattern)) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}