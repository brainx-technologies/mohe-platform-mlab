DashboardModules.triggerperkplex = function (moduleId) {
    var selector = "chart-" + moduleId;
    var chartContainer = $('#' + selector);
    var empty = $('#module-' + moduleId + ' .empty');

    var apiUrl = '/api/frontend/trigger-per-kplex/' + moduleId + '/';
    var updateInterval = 6000;

    // marker for updates
    var fingerprint = "";
    var kplex = {};

    chartContainer.hide();
    empty.show();

    var chart = Highcharts.chart(selector, {
        chart: {
            height: DASHBOARD_CHART_HEIGHT,
        },
        title: null,
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: null,
            allowDecimals: false,
        },
        plotOptions: {
            column: {
                tooltip: {
                    pointFormatter: function () {
                        return kplex[this.series.name] + ": " + this.y;
                    }
                }
            }
        },
        series: [{
            type: 'spline',
            name: 'Average',
            data: [],
            zIndex: 2,
            color: Highcharts.getOptions().colors[8],
            showInLegend: false,
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[8],
                fillColor: 'white'
            }
        }, {
            type: 'pie',
            name: 'Number of tests',
            data: [],
            center: [20, 40],
            size: 80,
            showInLegend: false,
            zIndex: 2,
            dataLabels: {
                enabled: false
            }
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

            kplex = data.kplex;

            var average = [];
            var pieData = [];

            while (chart.series.length > 2) {
                chart.series[2].remove();
            }

            for (var i = 0; i < data.result.length; i++) {
                var color = Highcharts.theme.colors[i + 2];
                var x = data.result[i];
                x.type = 'column';
                x.zIndex = 1;
                x.color = color;
                chart.addSeries(x);

                // prepare totals pie chart and averages
                var total = {name: x.name, y: 0, color: color};
                pieData.push(total);

                for (var j = 0; j < x.data.length; j++) {
                    if (average.length < j + 1) {
                        average.push([x.data[j][0], 0]);
                    }
                    average[j][1] += x.data[j][1];
                    total.y += x.data[j][1];
                }
            }

            // calculate averages
            for (var i = 0; i < average.length; i++) {
                average[i][1] = Math.round(average[i][1] / data.result.length * 10) / 10;
            }

            // update averages
            chart.series[0].update({data: average});

            // update totals
            chart.series[1].update({data: pieData});
        });
    }

    update();
};
