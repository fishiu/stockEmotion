function makeChartConfig(stockId, stockName, sentiData) {
    return {
        chart: {
            zoomType: null //决定拖动鼠标可缩放的维度，包括 'x','y'以及'xy'三种选项
        },

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
            selected: 1,
            inputEnabled: true  //支持日期选择的窗口
        },

        // 配置在 x 或 y 轴显示的项
        yAxis: {
            // floor: null,  //自动计算坐标轴极值的下限，number类型
            plotLines: [{
                width: 2,
                color: 'yellow'
            }]
        },

        series: [{
            name: stockName,
            id: '002475',
            data: sentiData,
            dataGrouping: {
                enabled: false
            }
        }],

        //标题与副标题
        title: {
            text: `${stockName}(${stockId}): 股民情绪走势`
        },

        // 图像与图例选项
        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        // 当鼠标悬停于某点，数据提示框及内容的格式
        tooltip: {
            enabled: true,
            split: false//当有多组序列（例如sentiment index和stock price），false意味着显示多组数据的截面值
            //valueDecimals: 4, // series.compare功能开启时，point.change显示的值
        },

        //导出相关功能配置选项
        exporting: {
            enabled: false
        },

        //版权信息
        credits: {
            enabled: false
        }
    };
}