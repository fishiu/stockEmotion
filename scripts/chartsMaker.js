let commonConfig = {
    // 时间筛选按钮
    rangeSelector: {
        buttons: [
            {
                type: 'hour',
                count: 6,
                text: '6h'
            }, {
                type: 'day',
                count: 1,
                text: '1D'
            }, {
                type: 'day',
                count: 5,
                text: '5D'
            }, {
                type: 'month',
                count: 1,
                text: '1M'
            }, {
                type: 'month',
                count: 3,
                text: '3M'
            }, {
                type: 'ytd',
                text: 'YTD'
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }
        ],
        selected: 2,
        inputEnabled: true  //支持日期选择的窗口
    },

    plotOptions: {
        series: {
            showInLegend: true
        }
    },

    tooltip: {
        split: false,
        shared: true
    },

    //版权信息
    credits: {
        enabled: false
    }
}

function stockChartConfig(stockId, stockName, sentiData) {
    let stockConfig = commonConfig;
    stockConfig['title'] = {
        text: `${stockName}(${stockId}): 股民情绪走势`
    };
    stockConfig['series'] = [{
        name: stockName,
        id: stockName,
        data: sentiData,
        dataGrouping: {
            enabled: false
        }
    }];
    return stockConfig;
}

function industryChartConfig(industry, sentiData) {
    let stockConfig = commonConfig;
    stockConfig['title'] = {
        text: `${industry}（行业）: 股民情绪走势`
    };
    stockConfig['series'] = [{
        name: industry,
        id: industry,
        data: sentiData,
        dataGrouping: {
            enabled: false
        }
    }];
    return stockConfig;
}