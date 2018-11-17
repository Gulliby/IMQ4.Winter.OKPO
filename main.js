function uploadFile(event, type) {
    var file = event.target.files[0];
    var reader = new FileReader();
    if (type === 'pie') {
        reader.onload = filePieUploadEnd;
    } else {
        reader.onload = fileLineUploadEnd;
    }
    
    reader.fileName = getFileNameWithoutExtension(file.name);
    reader.readAsText(file);
}

function initChart(nameOfChart, nameOfCategory, dataToInit) {
    Highcharts.chart('container', {
        chart: configureDefaultChartType(),
        title: {
            text: nameOfChart
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: configureDefaultPlotOptions(),
        series: [{
            name: nameOfCategory,
            colorByPoint: true,
            data: dataToInit
        }]
    });
};

function getFileNameWithoutExtension(fileName) {
    return fileName.split('.').slice(0, -1).join('.');
}

function filePieUploadEnd(event) {
    var arrayDataResult = [];
    var parseResult = Papa.parse(event.target.result);
    for(var i = 1; i < parseResult.data.length; i++) {
        arrayDataResult.push(
        {
            name: parseResult.data[i][0],
            y: parseInt(parseResult.data[i][1])
        });
    }

    initChart(event.target.fileName, parseResult.data[0][1], arrayDataResult);
}

function configureDefaultChartType() {
    return {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    };
}

function configureDefaultPlotOptions() {
    return {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }
    };
}

function fileLineUploadEnd(event) {
    var arrayDataResult = [];
    var parseResult = Papa.parse(event.target.result);
    for(var i = 1; i < parseResult.data.length; i++) {
        arrayDataResult.push([parseInt(parseResult.data[i][0]), parseInt(parseResult.data[i][1])]);
    }

    initLineChart(arrayDataResult, event.target.fileName, parseResult.data[0][0], parseResult.data[0][1]);
}

function initLineChart(dataToShow, fileName, xName, yName) {
    Highcharts.chart('container-line', {
        chart: configureLineChartType(),
        title: {
            text: fileName
        },
        xAxis: {
            reversed: false,
            title: {
                enabled: true,
                text: xName
            },
            labels: {
                format: '{value} km'
            },
            maxPadding: 0.05,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: yName
            },
            labels: {
                format: '{value}'
            },
            lineWidth: 2
        },
        legend: {
            enabled: false
        },
        tooltip: configureLineChartTooltip(),
        plotOptions: {
            spline: {
                marker: {
                    enable: false
                }
            }
        },
        series: [{
            name: yName,
            data: dataToShow
        }]
    });
}

function configureLineChartType() {
    return {
        type: 'spline',
        inverted: true
    };
}

function configureLineChartTooltip() {
    return {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x} km: {point.y}'
    };
}
