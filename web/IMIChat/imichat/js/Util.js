var IMIchat_Util = {
    post: function (controller, action, onSuccess, permissionId, pDataObj, qObj) {
        debugger;
        var formattedQString = qObj !== undefined ? ('&' + $.param(qObj)) : '';
        var formattedUEncodedData = pDataObj !== undefined ? $.param(pDataObj) : {};

        var permission = "groupadmin";
        if (permissionId !== undefined) {
            switch (permissionId) {
                case 0:
                    permission = "alladmin"
                    break;
                case 1:
                    permission = "groupadmin"
                    break;
                case 2:
                    permission = "teamadmin"
                    break;
                case 3:
                    permission = "agentadmin"
                    break;
            }
        }

        var ws = document.getElementById('txtHdnWorkspaceId').value;
        $.ajax({
            url: $("#baseurl").val() + "Handlers/Users_" + permission + ".ashx?action=" + controller + "_" + action + "&ws=" + ws + formattedQString,
            type: 'POST',
            headers: {
                'SESSTOKEN': $("#sesstoken").val(),
                'RTN': wmsutil.getGUID()
            },
            data: formattedUEncodedData,
            async: true,
            success: function (data) {
                if (wmsutil.checkSession(data) == false) {
                    wmsutil.sessionExpired(data);
                    return;
                }
                if (data !== '') {
                    onSuccess(JSON.parse(data));
                } else {
                    onSuccess();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (wmsutil.checkSession(errorThrown) == false) {
                    wmsutil.sessionExpired(errorThrown);
                    return;
                }
                console.log("Error: " + errorThrown);
            }
        });
    },
    postx: function (controller, action, params) {
        if (controller === undefined) {
            console.error("'controller' is param is required. View method defination" +
                "for more details.");
            return;
        }
        if (action === undefined) {
            console.error("'action' param is required. View method defination" +
                "for more details.");
            return;
        }
        if (params === undefined) {
            console.error("'params' param is required. View method defination" +
                "for more details.");
            return;
        }

        var formattedQString = params.queryString !== undefined ?
            ('&' + $.param(params.queryString)) :
            '';
        var formattedUEncodedData = '';

        // var formattedUEncodedData = params.postData !== undefined ?
        //     $.param(params.postData) : {};
        if (action == "savewidgetvisibility") {
            formattedUEncodedData = params.postData !== undefined ?
                params.postData : {};
        } else {
            formattedUEncodedData = params.postData !== undefined ?
                $.param(params.postData) : {};
        }

        var permission = "groupadmin";
        if (params.permissionId !== undefined) {
            switch (params.permissionId) {
                case 0:
                    permission = "alladmin"
                    break;
                case 1:
                    permission = "groupadmin"
                    break;
                case 2:
                    permission = "teamadmin"
                    break;
                case 3:
                    permission = "agentadmin"
                    break;
            }
        }

        $.ajax({
            url: $("#baseurl").val() + "Handlers/Users_" + permission + ".ashx?action=" +
                controller + "_" + action +
                "&ws=" + document.getElementById('txtHdnWorkspaceId').value +
                formattedQString,
            type: 'POST',
            headers: {
                'SESSTOKEN': $("#sesstoken").val(),
                'RTN': wmsutil.getGUID()
            },
            data: formattedUEncodedData,
            async: true,
            success: function (data) {
                if (wmsutil.checkSession(data) == false) {
                    wmsutil.sessionExpired(data);
                    return;
                }
                if (data !== '' && params.onSuccess !== undefined) {
                    try {
                        params.onSuccess(JSON.parse(data));
                    } catch (e) {
                        if (params.onSuccessUnparsed !== undefined) {
                            params.onSuccessUnparsed(data);
                        }
                    }
                } else {
                    params.onSuccess();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (wmsutil.checkSession(errorThrown) == false) {
                    wmsutil.sessionExpired(errorThrown);
                    return;
                }
                //TODO: Remove for production.
                //alert("Error: " + errorThrown);
                console.log("Error: " + errorThrown);
            }
        });
    },
    getReadableTimespan: function (data) {
        if (data === null) {
            return 'NA';
        }
        if (data === 0) {
            return '0s';
        }
        var formattedData = '';
        var counter = Math.floor(data / (24 * 60 * 60));
        if (counter > 0) {
            data = data % (24 * 60 * 60);
            formattedData = counter + 'd' + (data > 0 ? ' ' : '');

        }
        var counter = Math.floor(data / (60 * 60));
        if (counter > 0) {
            data = data % (60 * 60);
            formattedData += counter + 'h' + (data > 0 ? ' ' : '');
        }

        var counter = Math.floor(data / 60);
        if (counter > 0) {
            data = data % (60);
            formattedData += counter + 'm' + (data > 0 ? ' ' : '');
        }

        if (counter <= 0 && data > 0) {
            formattedData += data + 's';
        }

        return formattedData;
    },
    getFormattedLastUpdated: function (data, datetimenow) {
        if (datetimenow === undefined) {
            datetimenow = new Date();
        }
        var formattedData = '';
        var secondsElapsed = Math.floor((new Date(datetimenow) - new Date(data)) / (1000));
        var counter = Math.floor(secondsElapsed / (24 * 60 * 60));
        if (counter > 0) {
            formattedData = counter + ' day' + (counter > 1 ? 's' : '') + ' ago';
            return formattedData;
        }
        var counter = Math.floor(secondsElapsed / (60 * 60));
        if (counter > 0) {
            formattedData = counter + ' hour' + (counter > 1 ? 's' : '') + ' ago';
            return formattedData;
        }
        var counter = Math.floor(secondsElapsed / 60);
        if (counter > 0) {
            formattedData = counter + ' minute' + (counter > 1 ? 's' : '') + ' ago';
            return formattedData;
        }
        return secondsElapsed + ' second' + (secondsElapsed > 1 ? 's' : '') + ' ago';
    },
    updateBasicChart: function (containerId, xAxisData, yAxisData, additionalSeries) {
        var chart = $('#' + containerId).highcharts();
        var dataModelCol = $('#' + containerId).attr('name') !== undefined ? $('#' + containerId).attr('name').split('|') : [];

        var seriesIndex = 0
        if (dataModelCol.length < 2) {
            chart.series[seriesIndex].setData(yAxisData, true);
        } else {
            $.each(dataModelCol, function (index, model) {
                var modelSchema = model.split('^');
                chart.series[index].setData($.map(yAxisData, function (item) {
                    return item[modelSchema[0]];
                }), true);
                seriesIndex = index;
            });
        }

        if (additionalSeries !== undefined) {
            $.each(additionalSeries, function (index, data) {
                seriesIndex++;
                chart.series[seriesIndex].setData(data.seriesData.data, true);
            });
        }
    },
    drawBasicChart: function (containerId, xAxisData, yAxisData, calllbackTooltip, onColumnClick, seriesType, additionalSeries) {
        if ($('#' + containerId).hasClass('dashnodata')) {
            $('#' + containerId).removeClass('dashnodata');
        }
        var seriesData = new Array();
        var yAxisDetails = new Array();
        yAxisDetails.push({
            allowDecimals: false,
            min: 0,
            title: {
                text: $('#' + containerId).attr('data-y-title'),
                align: 'middle'
            }
        });

        var dataModelCol = $('#' + containerId).attr('name') !== undefined ?
            $('#' + containerId).attr('name').split('|') : [];
        if (dataModelCol.length < 2) {
            seriesData.push({
                type: seriesType === undefined ? 'column' : seriesType,
                name: $('#' + containerId).attr('data-name'),
                data: yAxisData,
                color: $('#' + containerId).attr('data-chart-color')
            });
        } else {
            $.each(dataModelCol, function (index, model) {
                var modelSchema = model.split('^');
                var chartColor = modelSchema.length > 2 ?
                    modelSchema[2] :
                    undefined;

                seriesData.push({
                    type: seriesType === undefined ? 'column' : seriesType,
                    name: modelSchema[1],
                    data: $.map(yAxisData, function (item) {
                        return item[modelSchema[0]];
                    }),
                    color: chartColor
                });
            });
        }

        if (additionalSeries !== undefined) {
            $.map(additionalSeries, function (data) {
                seriesData.push(data.seriesData);
                yAxisDetails.push(data.yAxis);
            });
        }

        var chartTitle = '';
        if ($('#' + containerId).attr('data-chart-description') !== undefined) {
            chartTitle = '<h3>' + $('#' + containerId).attr('data-name') +
                '&nbsp;<i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="" data-original-title="' + $('#' + containerId).attr('data-chart-description') + '"></i>' +
                '</h3>';
        }
        return Highcharts.chart(containerId, {
            title: {
                text: '',
                align: 'left',
                useHTML: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function (event) {
                            if (onColumnClick !== undefined) {
                                onColumnClick((event.point.category.id !== undefined ? event.point.category.id : event.point.category), event);
                            }
                        }
                    },
                    maxPointWidth: 100
                },
                column: {
                    stacking: 'normal'
                }
            },
            tooltip: {
                formatter: function () {
                    var formattedData = {};
                    if (this.points.length === 1) {
                        formattedData.name = this.points[0].point.series.name;
                        formattedData.y = this.points[0].y;
                        if (calllbackTooltip !== undefined) {
                            var retValue = calllbackTooltip(formattedData.name, formattedData.y);
                            if (retValue !== undefined) {
                                formattedData = retValue;
                            }
                        }
                        return '<span style="font-weight:bold;">' + formattedData.name + ': </span>' + formattedData.y;
                    }

                    var cusTooltip = '';
                    $.each(this.points, function (i, s) {
                        formattedData.name = s.point.series.name;
                        formattedData.y = s.y;
                        if (calllbackTooltip !== undefined) {
                            var retValue = calllbackTooltip(formattedData.name, formattedData.y);
                            if (retValue !== undefined) {
                                formattedData = retValue;
                            }
                        }
                        cusTooltip += '<span style="color:' + s.color + ';font-weight:bold;">' + formattedData.name + ': </span>' + formattedData.y + '<br/>';
                    });
                    return cusTooltip;
                },
                shared: true
            },
            exporting: {
                enabled: true,
                filename: $('#' + containerId).attr('data-name'),
                buttons: {
                    contextButton: {
                        menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.filter(function (item, index) {
                            if (item !== 'openInCloud') {
                                return true;
                            }
                            return false;
                        })
                    }
                }
            },
            xAxis: {
                categories: xAxisData,
                title: {
                    text: ($('#' + containerId).attr('data-x-title') !== undefined ?
                        $('#' + containerId).attr('data-x-title') :
                        'Timestamp'),
                    align: 'middle'
                },
                labels: {
                    formatter: function () {
                        if (this.value.label !== undefined) {
                            return this.value.label;
                        }
                        return this.value;
                    }
                }
            },
            yAxis: yAxisDetails,
            series: seriesData
        }, function () {
            $('[data-toggle="tooltip"]').tooltip();
            $('#' + containerId).parent().find('.loader').hide();
        });
    },
    clearInputFields: function (containerId) {
        $('#' + containerId + ' textarea').each(function () {
            wmsutil.destroyToolTip('#' + $(this).attr('id'));
            $(this).val('');
        });
        $('#' + containerId + ' input').each(function () {
            switch ($(this).attr('type')) {
                case 'radio':
                    $(this).prop('checked', false);
                case 'checkbox':
                    $(this).prop('checked', false);
                    break;
                default:
                    wmsutil.destroyToolTip('#' + $(this).attr('id'));
                    $(this).val('');
                    break;
            }
        });
    },
    isReal: function (evt, element, is_int_only) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (
            (is_int_only || (charCode != 46 || $(element).val().indexOf('.') != -1)) &&
            (charCode < 48 || charCode > 57))
            return false;

        return true;
    }
};
String.prototype.format = function () {
    var input_string = this;
    $.each(arguments, function (index, param) {
        var place_holder = '{' + index + '}'
        input_string = input_string.split(place_holder).join(param);
    });
    return input_string;
}