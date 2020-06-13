// 激活tooltip
$(function () {
    $("[data-toggle='tooltip']").tooltip();
});

let stockInfo;

// 获取公司信息
function getCompleteData() {
    let stockIdList = [];
    $.ajax({
        url: '/static/stockInfo.json',
        async: false,
        success: function (infoData) {
        stockInfo = infoData;
        console.log("获取股票信息成功");
        for (let i = 0; i < stockInfo.length; i++) {
            stockIdList.push(stockInfo[i]['code']);
        }
    }});
    console.log('hi');
    return stockIdList;
}

// 用来查找ID对应名称
function code2Name(stackCode) {
    for (let i = 0; i < stockInfo.length; i++) {
        if (stockInfo[i]['code'] === stackCode) {
            return {
                'name': stockInfo[i]['name'],
                'industry': stockInfo[i]['industry']
            };
        }
    }
    return '# N/A #';
}

// 自动提示补全
$(function () {
    $("#stock-input").typeahead({
        source: getCompleteData(), // 数据源
        items: 8,           //最多显示个数
        delay: 0,         //延迟时间
        //这里一定要return，否则选中不显示，外加调用display的时候null reference错误。
        updater: function (item) {
            return item;
        },
        //返回选中的字符串
        displayText: function (item) {
            return item + ' ' + code2Name(item)['name'];
        },
        //选择项之后的事件，item是当前选中的选项
        afterSelect: function (item) {
            console.log(item + ' ' + code2Name(item)['name']);
        }
    });
})

$(function () {
    // 处理按钮点击
    $('#singleStock').find('#search').click(function () {
        let queryStr = $('#singleStock').find('#stock-input').text();
        queryStr = queryStr.substring(0, 8);
        console.log("检索ID为：");
        console.log(queryStr);
        let idPattern = /^(SZ|SH)\d{6}/;
        if (!idPattern.test(queryStr)) {
            // alert("股票ID格式不正确！")
            $('#singleStock.tab-pane').prepend(
                `<div class="alert alert-danger alert-dismissable" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>请输入正确格式的股票代码！</strong>
                </div>`
            )
            return;
        }
        createChart(queryStr);
    });
})

$(function () {
    $('.stock-recommend').click(function () {
        let queryStr = $(this).text().substring(0, 8);
        createChart(queryStr);
    });
});


// 查询并生成图表
function createChart(stockId) {
    $.ajax({
        url: '/api/stockSenti.php',
        type: "get",
        data: {'stockId': stockId},
        dataType:"json",
        beforeSend: function () {
            $('#singleStock').find('.panel-heading').text('查询中...请耐心等待...')
        },
        success: function (sentiData) {
            console.log('查询成功');
            console.log(sentiData);
            let myStockInfo = code2Name(stockId);
            $('#singleStock').find('.panel-heading').html(`
            ${myStockInfo['name']} [${stockId}]<span style="padding: 10px;"></span>行业：${myStockInfo['industry']}
            `)
            let panelBody = $('#singleStock').find('.panel-body #chart');
            panelBody.text('');
            panelBody.css('height', '450px'); // panelBody.css('text-align', 'left');
            Highcharts.stockChart('chart', makeChartConfig(stockId, myStockInfo['name'], sentiData));
        },
        error: function () {
            alert('查询失败');
        }
    })
}