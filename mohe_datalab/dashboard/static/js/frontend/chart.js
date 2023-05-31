
const ctx = document.getElementById('teamActivity');
const ctxTests = document.getElementById('testsReports');
const ctxStockUsage = document.getElementById('mPlexStockUsage');

const nbr1 = document.getElementById("nbr-1");
const nbr2 = document.getElementById("nbr-2");
const nbr3 = document.getElementById("nbr-3");
const nbr4 = document.getElementById("nbr-4");
const nbr5 = document.getElementById("nbr-5");

const pNbr3 = document.getElementById("pnbr-3");
const pNbr4 = document.getElementById("pnbr-4");
const pNbr5 = document.getElementById("pnbr-5");

// var selector = "chart-" + moduleId;
// var chartContainer = $('#' + selector);
// var empty = $('#module-' + moduleId + ' .empty');

// chartContainer.hide();
// empty.show();

var apiUrl = '/api/frontend/team-activity/10/';
var updateInterval = 500;

var fingerprint = "";

// update team activity chart
const chart = new Chart(ctx, {

    type: 'bar',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Current Interval',
                data: [],
                backgroundColor: "#54D8FF",
                labels: {
                    color: 'blue' // Set the color of the dataset label here
                }
            },
            {
                label: 'Previous Interval',
                data: [],
                backgroundColor: "#FFA177",
                labels: {
                    color: 'green' // Set the color of the dataset label here
                }
            }
        ]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        categorySpacing: 5, // Adjust the space between categories here

        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#873375',
                    font: {
                        size: 10
                    },
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                    pointStyleWidth: 30,
                    borderRadius: 20
                }
            },
            title: {
                display: true,
                text: 'Team Activity'
            }
        }
    }
});

function updateChart() {

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const categories = data.categories;
            const currentData = data.period;
            const previousData = data.compare;

            chart.data.labels = categories;
            chart.data.datasets[0].data = currentData;
            chart.data.datasets[1].data = previousData;


            chart.update();
        })
        .catch((error) => {
            console.log(error);
            console.error("Error fetching data: ", error);
        });
}

setTimeout(updateChart, updateInterval);
// update team activity chart

// update stock chart
const stockChart = new Chart(ctxTests, {
    type: 'line',
    data: {
        labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October'
        ],
        datasets: [
            {
                label: '',
                fill: true,
                data: [],
                backgroundColor: "#d66d6e82",
                borderColor: "#D66D6E",
                tension: 0.5,
                pointStyleWidth: 30
            },
            {
                label: '',
                fill: false,
                data: [],
                borderColor: "#873375",
                backgroundColor: 'transparent',
                tension: 0.5
            },
            {
                label: '',
                fill: false,
                data: [],
                borderColor: "#54D8FF",
                tension: 0.5,
                backgroundColor: 'transparent',
                boxWidth: 10,
                boxHeight: 10
            },
            {
                label: '',
                fill: false,
                data: [],
                borderColor: "#981504",
                tension: 0.5,
                backgroundColor: 'transparent'
            },
            {
                label: '',
                fill: false,
                data: [],
                borderColor: "#FFA177",
                tension: 0.5,
                backgroundColor: 'transparent'
            },
            {
                label: '',
                fill: false,
                data: [],
                borderColor: "#FFA199",
                tension: 0.5,
                backgroundColor: 'transparent'
            }
        ]
    },
    options: {
        responsive: true,
        elements: {
            line: {
                borderWidth: 2
            }
        },
        plugins: {
            title: {
                display: false,
            },
            legend: {
                position: 'bottom',
                align: 'start',
                margin: {
                    top: 20, // add 20 pixels of margin at the top of the legend
                    bottom: 20, // add 20 pixels of margin at the bottom of the legend
                    left: 50, // no left margin
                    right: 50 // no right margin
                },
                labels: {
                    color: '#873375',
                    font: {
                        size: 10
                    },
                    usePointStyle: true,
                    generateLabels: function (chart) {
                        var labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                        // modify the style of each legend item's color box
                        labels.forEach(function (label) {
                            if (label.datasetIndex === 0) {
                                label.pointStyle = 'rectRounded';
                                label.pointStyleWidth = 30;
                            } else {
                                label.pointStyle = 'circle';
                                label.boxHeight = 10;
                                label.boxWidth = 10;
                            }
                        });
                        return labels;
                    }
                }
            },
        }
    }
});

function updateStockChart() {

    fetch("/api/frontend/testkit-stock/11/")
        .then((response) => response.json())
        .then((data) => {
            console.log("stock data :", data);

            for (var i = 0; i < data.result.length; i++) {

                stockChart.data.datasets[i].label = data.result[i].name;
                stockChart.data.datasets[i].data = data.result[i].data;

            }

            stockChart.update();

            // while (chart.series.length > data.result.count) {
            //     chart.series[chart.series.length - 1].remove();
            // }

            // const categories = data.categories;
            // const currentData = data.period;
            // const previousData = data.compare;

            // chart.data.labels = categories;
            // chart.data.datasets[0].data = currentData;
            // chart.data.datasets[1].data = previousData;


            // chart.update();
        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
        });
}

setTimeout(updateStockChart, updateInterval);
// update stock chart

new Chart(ctxStockUsage, {
    type: 'line',
    data: {
        labels: [
            'January',
            'February',
            'March',
            'April'
        ],
        datasets: [
            {
                label: 'Drugs of Abuse',
                fill: false,
                data: [860, 1140, 1060, 1060],
                borderColor: "#6E255E"
            },
            {
                label: 'Cardiac',
                fill: false,
                data: [1600, 1700, 1700, 1900],
                borderColor: "#B6962F"
            },
            {
                label: 'STD',
                fill: false,
                data: [300, 700, 2000, 5000],
                borderColor: "#A3B7ED"
            },
            {
                label: 'Hepatitis',
                fill: false,
                data: [100, 1000, 5000, 200],
                borderColor: "#DCEF4B"
            },
            {
                label: 'Pandemic',
                fill: false,
                data: [500, 900, 4000, 2000],
                borderColor: "#ACA8A8"
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: false,
            },
            legend: {
                display: false,
            }
        },
        elements: {
            line: {
                borderWidth: 2
            }
        },
        scales: {
            x: {
                ticks: {
                    drawTicks: false // remove tick marks
                },
                grid: {
                    drawBorder: false, // remove the vertical lines
                    display: false
                }
            }
        }
    }
});

// get results data
function getResults() {

    fetch("/api/frontend/results/13/")
        .then((response) => response.json())
        .then((data) => {

            console.log("results :", data);

        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
        });
}

setTimeout(getResults, updateInterval);
// get results data

// get numbers module data
function updateNbrs(moduleId) {
    fetch(`/api/frontend/number/${moduleId}/`)
        .then((response) => response.json())
        .then((data) => {

            console.log(`number${moduleId} data:`, data);
            var html = data.period;

            if (data.compare && data.period > 0) {
                console.log("here");
                var diff = Math.round((data.period - data.compare) / data.period * 100);

                if (diff > 0) {
                    diff = '+' + diff;
                }
                else if (diff == 0) {
                    diff = "&plusmn;0";
                }

                switch (moduleId) {
                    case 3:
                        pNbr3.innerHTML = `${diff}+%`;
                        break;
                    case 4:
                        pNbr4.innerHTML = `${diff}+%`;
                        break;
                    case 5:
                        pNbr5.innerHTML = `${diff}+%`;
                        break;
                }

            } else if ("compare" in data) {
                
                switch (moduleId) {
                    case 3:
                        pNbr3.innerHTML = '';
                        break;
                    case 4:
                        pNbr4.innerHTML = '';
                        break;
                    case 5:
                        pNbr5.innerHTML = '';
                        break;
                }

            }

            switch (moduleId) {
                case 1:
                    nbr1.innerHTML = html;
                    break;
                case 2:
                    nbr2.innerHTML = html;
                    break;
                case 3:
                    nbr3.innerHTML = html;
                    break;
                case 4:
                    nbr4.innerHTML = html;
                    break;
                case 5:
                    nbr5.innerHTML = html;
                    break;
            }

        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
        });
}

for (let i = 1; i < 6; i++) {
    setTimeout(updateNbrs(i), updateInterval);
}
// get numbers module data
