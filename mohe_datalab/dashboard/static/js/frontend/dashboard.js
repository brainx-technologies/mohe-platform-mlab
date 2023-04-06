var DASHBOARD_CHART_HEIGHT = 375;

DashboardModules = {};

DashboardModuleUpdate = [];

var resultMarker;

var resultOverlay = new ResultOverlay();

var GREEN = '#4dbe4d';
var ORANGE = '#f4b05d';

$(document).ready(function () {
    var cellHeight = ($(window).height() - 290) / 11;
    if (cellHeight < 60) {
        cellHeight = 60;
    }
    DASHBOARD_CHART_HEIGHT = cellHeight * 5.5;

    $('.grid-stack').gridstack({
        cellHeight: cellHeight,
        disableResize: true,
        handle: '.grid-stack-item-content .move'
    });

    var serializeWidgetMap = function (items) {
        var data = [];
        for (var i = 0; i < items.length; i++) {
            data.push([items[i].el.data('id'), items[i].x, items[i].y]);
        }
        $.get('/api/frontend/widget/', {update: JSON.stringify(data)});
    };

    $('.grid-stack').on('change', function (event, items) {
        if (items != undefined) {
            serializeWidgetMap(items);
        }
    });

    $('.module').each(function () {
        var type = $(this).data('module');
        var moduleId = $(this).data('id');
        DashboardModules[type](moduleId);
    });

    $('body').on('click', '.module .delete', function () {
        var module = $(this).closest('.module');
        var item = $(this).closest('.grid-stack-item');
        var pk = module.data('id');
        item.fadeOut(function () {
            $.get('/api/frontend/widget/', {delete: pk});
            var grid = $('.grid-stack').data('gridstack');
            grid.removeWidget(module);
        });
    });

    function dashboardUpdate() {
        if ($('#sidebar [name=update]').val() == "1") {
            return;
        }

        var query = $("#sidebar form").serializeArray();
        $.post('.', query, function (data) {
            DashboardModuleUpdate.forEach(function (callback) {
                callback();
            });
        });
    }

    $('#sidebar form input').on('change', dashboardUpdate);
    $('#sidebar form select').on('change', dashboardUpdate);


    $('[name="period_from"],[name="period_to"],[name="compare_from"],[name="compare_to"]').datepicker({
        autoHide: true,
        format: 'yyyy-mm-dd',
        pick: dashboardUpdate
    });

    var periodUpdate = function () {
        var period = $('#id_period').val();
        if (period == 999) {
            $('#id_period_from').removeAttr("disabled");
            $('#id_period_to').removeAttr("disabled");
        }
        else {
            $('#id_period_from').val("");
            $('#id_period_from').attr("disabled", "disabled");

            $('#id_period_to').val("");
            $('#id_period_to').attr("disabled", "disabled");
        }
    };

    var compareUpdate = function () {
        var period = $('#id_compare').val();
        if (period == 2) {
            $('#id_compare_from').removeAttr("disabled");
            $('#id_compare_to').removeAttr("disabled");
        }
        else {
            $('#id_compare_from').val("");
            $('#id_compare_from').attr("disabled", "disabled");

            $('#id_compare_to').val("");
            $('#id_compare_to').attr("disabled", "disabled");
        }
    };

    periodUpdate();
    $('#id_period').change(periodUpdate);

    compareUpdate();
    $('#id_compare').change(compareUpdate);
});


