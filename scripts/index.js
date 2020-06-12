$(function () { $("[data-toggle='tooltip']").tooltip(); });

$(function () {
    $('#singleStock .dropdown-menu li a').click(function () {
        let stockType = $(this).text();
        $('#singleStock .dropdown-toggle').html(stockType + ' ' + '<span class="caret"></span>');
    });
})

function getCompleteData() {
    if ($('#singleStock .dropdown-toggle').text() === 'SH ') {
        return ['708898', '478829', '124288', '897822'];
    } else {
        return ['708898', '478829', '124288', '897822'];
    }
}

function code2Name(stackCode) {
    return '精密仪器';
}

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
            return item + ' ' + code2Name(item);
        },
        //选择项之后的事件，item是当前选中的选项
        afterSelect: function (item) {
            console.log(item + ' ' + code2Name(item));
        }
    });
})