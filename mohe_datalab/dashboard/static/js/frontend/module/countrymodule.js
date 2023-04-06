DashboardModules.countrymodule = function (moduleId) {
    var selector = "chart-" + moduleId;
    var apiUrl = '/api/frontend/country/' + moduleId + '/';
    var updateInterval = 10000;

    var chart = Highcharts.mapChart(selector, {
        chart: {
            borderWidth: 0,
            height: DASHBOARD_CHART_HEIGHT
        },
        title: {text: null},
        legend: {
            align: 'right',
            verticalAlign: 'bottom',
            floating: true,
            layout: 'vertical',
            valueDecimals: 0,
            symbolRadius: 0,
            symbolHeight: 14,
        },

        mapNavigation: {
            enabled: false
        },

        colorAxis: {
            dataClasses: [{
                to: 10
            }, {
                from: 10,
                to: 100
            }, {
                from: 100,
                to: 1000
            }, {
                from: 1000,
                to: 10000
            }, {
                from: 10000
            }]
        },

        series: [{
            animation: {
                duration: 1000
            },
            data: [],
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            name: 'Trigger'
        }]
    });

    function update() {
        $.get(apiUrl, function (data) {
            var mapName = 'countries/' + data.country + '/' + data.country + '-all';
            chart.series[0].update({
                mapData: Highcharts.maps[mapName],
                data: data.result
            });
            window.setTimeout(update, updateInterval);
        });
    }

    update();
};
