// 激活tooltip
$(function () {
    $("[data-toggle='tooltip']").tooltip();
});

let stockInfo;
let industryList;

// 获取公司信息
function getStockInfo() {
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

function getIndustryList() {
    $.ajax({
        url: '/static/industry.json',
        async: false,
        success: function (infoData) {
            industryList = infoData;
            console.log("获取行业列表成功");
        }});
    return industryList;
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
        source: getStockInfo(), // 数据源
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

    $("#industry-input").typeahead({
        source: getIndustryList(), // 数据源
        items: 8,           //最多显示个数
        delay: 0,         //延迟时间
        //这里一定要return，否则选中不显示，外加调用display的时候null reference错误。
        updater: function (item) {
            return item;
        },
        //返回选中的字符串
        displayText: function (item) {
            return item;
        },
        //选择项之后的事件，item是当前选中的选项
        afterSelect: function (item) {
            console.log(item);
        }
    });
})

// 处理按钮点击
$(function () {
    $('#singleStock').find('#stock-search').click(function () {
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
        createChart(queryStr, 'stock');
    });

    $('#industry').find('#industry-search').click(function () {
        let queryStr = $('#industry').find('#industry-input').text();
        console.log("检索ID为：");
        console.log(queryStr);
        if (queryStr in industryList) {
            // alert("行业名称不正确！")
            $('#singleStock.tab-pane').prepend(
                `<div class="alert alert-danger alert-dismissable" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>查询的行业不存在！</strong>
                </div>`
            )
            return;
        }
        createChart(queryStr, 'industry');
    });
})

// 热门推荐搜索
$(function () {
    $('.stock-recommend').click(function () {
        let queryStr = $(this).text().substring(0, 8);
        createChart(queryStr, 'stock');
    });
    $('.industry-recommend').click(function () {
        let queryStr = $(this).text();
        createChart(queryStr, 'industry');
    });
});


// 查询并生成图表
function createChart(queryStr, type) {
    let node;
    if (type === 'stock') node = $('#singleStock');
    else node = $('#industry');

    $.ajax({
        url: '/api/stockSenti.php',
        type: "get",
        data: {'queryStr': queryStr, 'type': type},
        dataType:"json",
        beforeSend: function () {
            node.find('.panel-heading').text('查询中...请耐心等待...')
        },
        success: function (sentiData) {
            console.log('查询成功');
            console.log(sentiData);
            if (type === 'stock') {
                let myStockInfo = code2Name(queryStr);
                node.find('.panel-heading').html(`${myStockInfo['name']} [${queryStr}]<span style="padding: 10px;"></span>行业：${myStockInfo['industry']}`);
            } else {
                node.find('.panel-heading').html(`行业：${queryStr}`);
            }
            let panelBody = node.find(`.panel-body #${type}-chart`);
            panelBody.text('');
            panelBody.css('height', '450px');
            if (type === 'stock') Highcharts.stockChart('stock-chart', stockChartConfig(queryStr, stockInfo['name'], sentiData));
            else Highcharts.stockChart('industry-chart', industryChartConfig(queryStr, sentiData));
        },
        error: function () {
            alert('查询失败');
        }
    });
}