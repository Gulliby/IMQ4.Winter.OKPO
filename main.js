function uploadFile(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = fileUploadEnd;
    
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

function fileUploadEnd(event) {
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
