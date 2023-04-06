DashboardModules.teamactivity = function (moduleId) {
    var selector = "chart-" + moduleId;
    var chartContainer = $('#' + selector);
    var empty = $('#module-' + moduleId + ' .empty');

    chartContainer.hide();
    empty.show();

    var apiUrl = '/api/frontend/team-activity/' + moduleId + '/';
    var updateInterval = 3000;

    var fingerprint = "";

    var chart = Highcharts.chart(selector, {
        chart: {
            height: DASHBOARD_CHART_HEIGHT,
            type: 'bar'
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

            chart.update({xAxis: {categories: data.categories}});
            chart.series[0].update({data: data.period});
            chart.series[1].update({data: data.compare});
        });
    }

    update();
};
