DashboardModules.devicecapacity = function (moduleId) {
    var selector = "chart-" + moduleId;
    var apiUrl = '/api/frontend/device-capacity/' + moduleId + '/';
    var updateInterval = 10000;

    var chart = Highcharts.chart(selector, {
        chart: {
            height: DASHBOARD_CHART_HEIGHT,
            type: 'scatter',
            zoomType: 'x'
        },
        title: null,
        xAxis: {
            title: {
                text: 'Number of tests'
            },
        },
        yAxis: {
            title: {
                text: 'Battery (%)'
            },
            allowDecimals: false,
            min: 0,
            max: 100,
        },
        plotOptions: {
            scatter: {
                zones: [{
                    value: 20,
                    color: 'red'
                }, {
                    value: 50,
                    color: 'gold'
                }, {
                    color: 'green'
                }],
                marker: {
                    radius: 8,
                    lineWidth: 1,
                    lineColor: '#666666',
                    symbol: 'triangle'
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b> tests executed<br>',
                    pointFormat: '{point.y}% battery remaining'
                }
            },
        },
        legend: {
            enabled: true
        },
        series: [{
            name: 'Remaining reader capacity',
            data: []
        }]
    });

    function update() {
        $.get(apiUrl, function (data) {
            chart.series[0].update({data: data.result});
            window.setTimeout(update, updateInterval);
        });
    }

    update();
};
