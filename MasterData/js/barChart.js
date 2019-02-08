// Return with commas in between
var numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

var dataPack1 = [148.5, 149.5, 156.5, 172, 192.25, 210.5, 215, 216.75];
var dataPack2 = [50.5, 54.75, 58.75, 54.25, 38.5, 21, 16.5, 21];
var tragetDemanded = [36.5, 39.75, 41.75, 40, 34.5, 14, 2.5, 2.5];
var projectRampUp = [162.5, 164.5,	173.5,	186,	196.25,	217.75,	229.25,	235.25];
var dates = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function getBarChart() {
var bar_ctx = document.getElementById('myChart');
var myChart = new Chart(bar_ctx, {
    type: 'bar',
    data: {
        labels: dates,
        datasets: [
            {
                label: 'Actual',
                data: dataPack1,
                backgroundColor: "#006080",
                hoverBackgroundColor: "#006070",
                hoverBorderWidth: 2,
                hoverBorderColor: 'lightgrey'
            },
            {
                label: 'Open Position',
                data: dataPack2,
                backgroundColor: "#009999",
                hoverBackgroundColor: "#009989",
                hoverBorderWidth: 2,
                hoverBorderColor: 'lightgrey'
            },
            {
                label: 'Projected Ramp Up',
                data: projectRampUp,
                borderColor: "#47476b",
                fill: false,
                type: 'line'
            },
            {
                label: 'Target/Demand(HC)',
                data: tragetDemanded,
                borderColor: "#800000",
                fill: false,
                type: 'line'
            },
        ]
    },
    options: {
        animation: {
            duration: 10,
        },
        tooltips: {
            mode: 'label',
            callbacks: {
                label: function (tooltipItem, data) {
                    return data.datasets[tooltipItem.datasetIndex].label + ": " + numberWithCommas(tooltipItem.yLabel);
                }
            }
        },
        scales: {
            xAxes: [{
                stacked: true,
                gridLines: { display: false },
            }],
            yAxes: [{
                stacked: true,
                stepSize: 50,
                ticks: {
                    callback: function (value) { return numberWithCommas(value); },
                },
            }],
        }, // scales
        legend: { display: true }
    } // options
}
);
}