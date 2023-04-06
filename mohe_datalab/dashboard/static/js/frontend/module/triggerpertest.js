DashboardModules.triggerpertest = function (moduleId) {
    var selector = "chart-" + moduleId;
    var empty = $('#module-' + moduleId + ' .empty');
    var chartContainer = $('#' + selector);

    var apiUrl = '/api/frontend/trigger-per-test/' + moduleId + '/';
    var updateInterval = 3000;
    var parameters = {};

    chartContainer.hide();
    empty.show();

    var fingerprint = "";

    var chart = Highcharts.chart(selector, {
        chart: {
            height: DASHBOARD_CHART_HEIGHT,
            type: 'column'
        },
        title: null,
        xAxis: {
            categories: [],
        },
        yAxis: {
            title: null,
            allowDecimals: false,
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            series: {
                tooltip: {
                    headerFormat: '',
                    pointFormatter: function () {
                        return parameters[this.category] + ": " + this.y;
                    }
                }
            }
        },
        series: [{
            name: 'Current interval',
            data: []
        }, {
            name: 'Previous interval',
            data: []
        }]
    });

    function update() {
        $.get(apiUrl, function (data) {
            window.setTimeout(update, updateInterval);

            if (fingerprint == data.fingerprint) {
                return;
            }
            fingerprint = data.fingerprint;

            if (data.count == 0) {
                chartContainer.hide();
                empty.show();
                return;
            }

            empty.hide();
            chartContainer.show();

            parameters = data.parameters;
            chart.update({xAxis: {categories: data.categories}});
            chart.series[0].update({data: data.period});
            chart.series[1].update({data: data.compare});
        });
    }

    update();
};
