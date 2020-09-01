function loadPieChart(cardChart) {
    cardChart.find('.card-body').myLoading();
    var eChartContainer = echarts.init(cardChart.find('.echart')[0]);
    $.get(cardChart.data('chart-url'), function (response) {
        cardChart.find('.card-body').myUnloading();
        let totalDOM = cardChart.find('.card-total');
        if (totalDOM.length) {
            totalDOM.text(response.total);
        }
        var option1 = {
            tooltip: {
                show: true,
                backgroundColor: '#fff',
                borderRadius: 6,
                padding: 6,
                axisPointer: {
                    lineStyle: {
                        width: 0,
                    }
                },
                textStyle: {
                    color: '#324148',
                    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                    fontSize: 12
                }
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '80%',
                    color: response.color,
                    data: response.data,
                    label: {
                        normal: {
                            formatter: '{b}\n{d}%'
                        }
                    }
                }
            ]
        };
        eChartContainer.setOption(option1);
        eChartContainer.resize();
    });
}

function loadBarChart(cardChart) {
    var eChartContainer = echarts.init(cardChart.find('.echart')[0]);
    cardChart.find('.card-body').myLoading();

    $.get(cardChart.data('chart-url'), function (response) {
        cardChart.find('.card-body').myUnloading();

        var posList = [
            'left', 'right', 'top', 'bottom',
            'inside',
            'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
            'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
        ];

        let app = {};
        app.configParameters = {
            rotate: {
                min: -90,
                max: 90
            },
            align: {
                options: {
                    left: 'left',
                    center: 'center',
                    right: 'right'
                }
            },
            verticalAlign: {
                options: {
                    top: 'top',
                    middle: 'middle',
                    bottom: 'bottom'
                }
            },
            position: {
                options: echarts.util.reduce(posList, function (map, pos) {
                    map[pos] = pos;
                    return map;
                }, {})
            },
            distance: {
                min: 0,
                max: 100
            }
        };

        app.config = {
            rotate: 90,
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
            distance: 15,
            onChange: function () {
                var labelOption = {
                    normal: {
                        rotate: app.config.rotate,
                        align: app.config.align,
                        verticalAlign: app.config.verticalAlign,
                        position: app.config.position,
                        distance: app.config.distance
                    }
                };
                myChart.setOption({
                    series: [{
                        label: labelOption
                    }, {
                        label: labelOption
                    }, {
                        label: labelOption
                    }, {
                        label: labelOption
                    }]
                });
            }
        };

        var labelOption = {
            show: true,
            position: app.config.position,
            distance: app.config.distance,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            rotate: app.config.rotate,
            formatter: '{c}  {name|{a}}',
            fontSize: 16,
            rich: {}
        };

        for (let i = 0; i < response.data.length; i++) {
            response.data[i].label = labelOption;
        }

        option = {
            color: response.color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: response.legend
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {show: false},
                    data: response.xaxis_data
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: response.data
        };

        eChartContainer.setOption(option);
        eChartContainer.resize();
    });
}

function loadMiniList(card) {
    card.find('.card-body').myLoading();

    let url = card.data('url-get-data');

    if (!url) {
        return false;
    }

    $.get(url, function (response) {
        card.find('.card-body').myUnloading();
        card.find('.card-body').find('tbody').html(response);
        card.find('[data-toggle="popover"]').popover({html: true});
    });
}

$(function () {
    $('.card-pie-chart').each(function (index, cardChartEle) {
        var cardChart = $(cardChartEle);
        cardChart.find('.refresh').on('click', function () {
            loadPieChart(cardChart);
        });
        loadPieChart(cardChart);
    });

    $('.card-bar-chart').each(function (index, cardChartEle) {
        var cardChart = $(cardChartEle);
        cardChart.find('.refresh').on('click', function () {
            loadBarChart(cardChart);
        });
        loadBarChart(cardChart);
    });

    $('.mini-list').each(function (index, ele) {
        var miniList = $(ele);
        miniList.find('.refresh').on('click', function () {
            loadMiniList(miniList);
        });
        loadMiniList(miniList);
    });

});