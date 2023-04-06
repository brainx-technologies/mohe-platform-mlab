DashboardModules.testkitstock = function (moduleId) {
    var selector = "chart-" + moduleId;
    var apiUrl = '/api/frontend/testkit-stock/' + moduleId + '/';
    var updateInterval = 10000;

    var chartContainer = $('#' + selector);
    var empty = $('#module-' + moduleId + ' .empty');


    console.log(selector);
    var chart = Highcharts.chart(selector, {
        chart: {
            height: DASHBOARD_CHART_HEIGHT,
            type: 'line'
        },
        title: null,
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: null,
            allowDecimals: false
        },
        legend: {
            enabled: true
        },
        series: []
    });

    function update() {
        $.get(apiUrl, function (data) {

            if (data.result.count == 0) {
                chartContainer.hide();
                empty.show();
                return;
            }

            empty.hide();
            chartContainer.show();

            for (var i = 0; i < data.result.length; i++) {
                console.log(data.result.length + " " + chart.series.length);
                if (i < chart.series.length) {
                    chart.series[i].setData(data.result[i]);
                }
                else {
                    chart.addSeries(data.result[i], true, true);
                }
            }

            while (chart.series.length > data.result.count) {
                chart.series[chart.series.length - 1].remove();
            }
        });
    }

    update();
};
