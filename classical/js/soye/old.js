function getBetRecordOld(page, type, status, ppdate) {
    // $('.tab_content_' + status).html('');
    // $('.tab_track_' + status).html('');
    pam.page = page
    pam.type = type
    pam.status = status
    pam.ppdate = ppdate
    ppdate = ppdate || 0;
    pdate = pdate - ppdate;
    var total = 0;
    var seadata = {
        'page': page, // 页数，从1开始
        'pageSize': pageSize, // 每页行数
        'searchType': type, // 查询类型，1为投注记录查询，2为追号查询
        'statusType': status, // 状态：1全部，2未开奖，3已中奖，4未中奖,81异常处理中
        lotteryId: getCookie('lt_lottid'), // 彩种ID
        pdate: pdate,
    };
    $.ajax({
        type: 'post',
        headers: {
            'Authorization': 'bearer ' + access_token,
        },
        dataType: 'json',
        contentType: 'application/json; charset=utf-8', // json格式传给后端
        url: action.forseti + 'api/orders/orderList',
        data: JSON.stringify(seadata), // json格式
        success: function (res) {
            $('.so-zzjz')
                .hide();
            //  var mon = res.data.rows[0].pcode.toString().substring(4,6) ;  // 月份
            //  var day = res.data.rows[0].pcode.toString().substring(6,8) ;  // 月份
            //  $('.title-data').text(mon+'月'+day+'日') ;

            var daysArr = {}; // 帅选相同日期数组
            total = res.data.total;
            if (res.data == null) {
                return;
            }
            res.data.rows.sort(function (a, b) {
                if (a.pdate > b.pdate) {
                    return 1; // a排在b的前面
                } else if (a.pdate < b.pdate) {
                    return -1; // a排在b的后面
                } else {
                    return 0; // a和b的位置保持不变
                }
            });

            $.each(res.data.rows, function (i, v) {
                // v.pcodeStr = v.pcode.toString()
                //     .substring(0, 8); // 截取日期前面6位
                daysArr[v.pdate] = daysArr[v.pdate] || [];
                daysArr[v.pdate].push(v);
                pdate = v.pdate;
            });
            console.log(daysArr);
            var li_html = '';
            //   $('.bet-recode-all').append(str) ;
            if (type === 1 && page === 1) {
                $.each(daysArr, function (j, m) {
                    dateDay.push(j);
                    restr += '<li class="slide_toggle bet_day " data-val="' + j + '">' +
                        '<div class="panel_title"> <strong class="title-data">' + j.toString()
                            .substring(4, 6) + '月' + j.toString()
                            .substring(6, 8) + '日 </strong><span></span> </div>' +
                        '<ul class="panel bet-recode-all">';
                    $.each(m, function (i, v) {
                        var statusStr = '';
                        if (status == 1) {
                            statusStr = '全部';
                        } else if (status == 2) {
                            statusStr = '等待开奖';
                        } else if (status == 3) {
                            statusStr = '已派彩';
                        } else if (status == 4) {
                            statusStr = '未中奖';
                        }
                        if (statusStr == v.orderStatusName || statusStr == '全部') {
                            var jsonStr = encodeURI('betting_record_dt01.html?data=' + JSON.stringify(v));
                            li_html += '<li class="bet_data" data-status="not_open">' +
                                '<a href="' + jsonStr + '">' +
                                '<div class="badge ssc_badge"></div>' +
                                '<div class="lottery_t ssc">' +
                                '<p>' + v.lotteryName + ' - <span>' + v.playName + '</span></p> <strong>' + roundAmt(v.betAmount) + '</strong> </div>' +
                                '<div class="status status0"' + v.orderStatus + '>' +
                                '<span>' + v.orderStatusName + '</span>' +
                                '<div>' + v.pcode + '期</div>' +
                                '</div>' +
                                ' </a>' +
                                '</li>';
                        }

                    });
                    restr += li_html;
                    restr += '</ul></li>';
                    if (li_html == '') {
                        restr = '';
                    }
                });
                $('.tab_content_' + status)
                    .append(restr);
                $('.slide_toggle')
                    .first()
                    .addClass('active');
                $('.slide_toggle ul')
                    .show();

            } else if (type === 2 && page === 1) {
                $.each(daysArr, function (j, m) {
                    dateDay.push(j);
                    restr += '<li class="slide_toggle bet_day " data-val="' + j + '">' +
                        '<div class="panel_title"> <strong class="title-data">' + j.toString()
                            .substring(4, 6) + '月' + j.toString()
                            .substring(6, 8) + '日 </strong><span></span> </div>' +
                        '<ul class="panel bet-recode-all">';
                    $.each(m, function (i, v) {
                        var statusStr = '';
                        if (status == 1) {
                            statusStr = '全部';
                        } else if (status == 2) {
                            statusStr = '进行中';
                        } else if (status == 3) {
                            statusStr = '已结束';
                        } else if (status == 4) {
                            statusStr = '已终止';
                        }
                        if (statusStr == v.chaseStatusName || statusStr == '全部') {
                            var jsonStr = encodeURI('trace_record_dt01.html?data=' + JSON.stringify(v));
                            li_html += '<li class="bet_data" data-status="not_open">' +
                                '<a href="' + jsonStr + '">' +
                                '<div class="badge ssc_badge"></div>' +
                                '<div class="lottery_t ssc">' +
                                '<p>' + v.lotteryName + ' - <span>' + v.playName + '</span></p> <strong>' + roundAmt(v.betAmount) + '</strong> </div>' +
                                '<div class="status status0"' + v.orderStatus + '>' +
                                '<span>' + v.chaseStatusName + '</span>' +
                                '<div>' + v.pcode + '期</div>' +
                                '</div>' +
                                ' </a>' +
                                '</li>';
                        }
                    });
                    restr += li_html;
                    restr += '</ul></li>';
                    if (li_html == '') {
                        restr = '';
                    }
                });
                $('.tab_track_' + status)
                    .append(restr);
                $('.slide_toggle')
                    .first()
                    .addClass('active');
                $('.slide_toggle ul')
                    .show();
            }

            if (page > 1 && type === 1) {
                $.each(daysArr, function (j, m) {
                    if (dateDay.indexOf(j) >= 0) {
                        $('.slide_toggle')
                            .each(function (i, t) {
                                if (parseInt($(t)
                                        .data('val'), 10) === parseInt(j, 10)) {
                                    $.each(m, function (j, v) {
                                        var jsonStr = encodeURI('betting_record_dt01.html?data=' + JSON.stringify(v));
                                        var li_html = '<li class="bet_data" data-status="not_open">' +
                                            '<a href="' + jsonStr + '">' +
                                            '<div class="badge ssc_badge"></div>' +
                                            '<div class="lottery_t ssc">' +
                                            '<p>' + v.lotteryName + ' - <span>' + v.playName + '</span></p> <strong>' + roundAmt(v.betAmount) + '</strong> </div>' +
                                            '<div class="status status0"' + v.orderStatus + '>' +
                                            '<span>' + v.orderStatusName + '</span>' +
                                            '<div>' + v.pcode + '期</div>' +
                                            '</div>' +
                                            ' </a>' +
                                            '</li>';
                                        $('.slide_toggle ul')
                                            .append(li_html);
                                    });
                                }
                            });
                    } else {
                        dateDay.push(j);
                        restr += '<li class="slide_toggle bet_day " data-val="' + j + '">' +
                            '<div class="panel_title"> <strong class="title-data">' + j.toString()
                                .substring(4, 6) + '月' + j.toString()
                                .substring(6, 8) + '日 </strong><span></span> </div>' +
                            '<ul class="panel bet-recode-all">';
                        $.each(m, function (i, v) {
                            var statusStr = '';
                            if (status == 1) {
                                statusStr = '全部';
                            } else if (status == 2) {
                                statusStr = '等待开奖';
                            } else if (status == 3) {
                                statusStr = '已派彩';
                            } else if (status == 4) {
                                statusStr = '未中奖';
                            }
                            if (statusStr == v.orderStatusName || statusStr == '全部') {
                                var jsonStr = encodeURI('betting_record_dt01.html?data=' + JSON.stringify(v));
                                li_html += '<li class="bet_data" data-status="not_open">' +
                                    '<a href="' + jsonStr + '">' +
                                    '<div class="badge ssc_badge"></div>' +
                                    '<div class="lottery_t ssc">' +
                                    '<p>' + v.lotteryName + ' - <span>' + v.playName + '</span></p> <strong>' + roundAmt(v.betAmount) + '</strong> </div>' +
                                    '<div class="status status0"' + v.orderStatus + '>' +
                                    '<span>' + v.orderStatusName + '</span>' +
                                    '<div>' + v.pcode + '期</div>' +
                                    '</div>' +
                                    ' </a>' +
                                    '</li>';
                            }

                        });
                        restr += li_html;
                        restr += '</ul></li>';
                        if (li_html == '') {
                            restr = '';
                        }
                        $('.tab_content_' + status)
                            .append(restr);

                    }

                });
            } else if (page > 1 && type === 2) {
                $.each(daysArr, function (j, m) {
                    if (dateDay.indexOf(j) >= 0) {
                        $('.slide_toggle')
                            .each(function (i, t) {
                                if (parseInt($(t)
                                        .data('val'), 10) === parseInt(j, 10)) {
                                    $.each(m, function (j, v) {
                                        var statusStr = '';
                                        if (status == 1) {
                                            statusStr = '全部';
                                        } else if (status == 2) {
                                            statusStr = '进行中';
                                        } else if (status == 3) {
                                            statusStr = '已结束';
                                        } else if (status == 4) {
                                            statusStr = '已终止';
                                        }
                                        if (statusStr == v.chaseStatusName || statusStr == '全部') {
                                            var jsonStr = encodeURI('trace_record_dt01.html?data=' + JSON.stringify(v));
                                            li_html = '<li class="bet_data" data-status="not_open">' +
                                                '<a href="' + jsonStr + '">' +
                                                '<div class="badge ssc_badge"></div>' +
                                                '<div class="lottery_t ssc">' +
                                                '<p>' + v.lotteryName + ' - <span>' + v.playName + '</span></p> <strong>' + roundAmt(v.betAmount) + '</strong> </div>' +
                                                '<div class="status status0"' + v.orderStatus + '>' +
                                                '<span>' + v.chaseStatusName + '</span>' +
                                                '<div>' + v.pcode + '期</div>' +
                                                '</div>' +
                                                ' </a>' +
                                                '</li>';
                                        }
                                        $('.slide_toggle ul')
                                            .append(li_html);
                                    });
                                }
                            });
                    } else {
                        dateDay.push(j);
                        restr += '<li class="slide_toggle bet_day " data-val="' + j + '">' +
                            '<div class="panel_title"> <strong class="title-data">' + j.toString()
                                .substring(4, 6) + '月' + j.toString()
                                .substring(6, 8) + '日 </strong><span></span> </div>' +
                            '<ul class="panel bet-recode-all">';
                        $.each(m, function (i, v) {
                            var statusStr = '';
                            if (status == 1) {
                                statusStr = '全部';
                            } else if (status == 2) {
                                statusStr = '进行中';
                            } else if (status == 3) {
                                statusStr = '已结束';
                            } else if (status == 4) {
                                statusStr = '已终止';
                            }
                            if (statusStr == v.chaseStatusName || statusStr == '全部') {
                                var jsonStr = encodeURI('trace_record_dt01.html?data=' + JSON.stringify(v));
                                li_html += '<li class="bet_data" data-status="not_open">' +
                                    '<a href="' + jsonStr + '">' +
                                    '<div class="badge ssc_badge"></div>' +
                                    '<div class="lottery_t ssc">' +
                                    '<p>' + v.lotteryName + ' - <span>' + v.playName + '</span></p> <strong>' + roundAmt(v.betAmount) + '</strong> </div>' +
                                    '<div class="status status0"' + v.orderStatus + '>' +
                                    '<span>' + v.chaseStatusName + '</span>' +
                                    '<div>' + v.pcode + '期</div>' +
                                    '</div>' +
                                    ' </a>' +
                                    '</li>';
                            }
                        });
                        restr += li_html;
                        restr += '</ul></li>';
                        if (li_html == '') {
                            restr = '';
                        }
                        $('.tab_track_' + status)
                            .append(restr);
                    }

                });
            }


            // 判断有多少条
            if (total === pageSize) {
                lock = 0;// 解锁
            }
            if (initViewLock === 0) {
                initViewLock++
                initView(status);
            }
        },
        error: function () {
            //
        },
    });
}

/* eslint-disable new-cap,indent */
access_token = getCookie('access_token'); // 取token
var membalance = getCookie('membalance');
$('.so-membalance')
    .html(membalance);

// getBetRecord(1, 1, 1); // 投注记录

TouchSlide({
    slideCell: '#betting_record',
});
TouchSlide({
    slideCell: '#trace_record',
});


var dateDay = [];
var nowDate = new Date();
var pdate = '' + (nowDate.getYear() + 1900) + (nowDate.getMonth() + 1) + nowDate.getDate();
var pam = {
    page: 0, type: 0, status: 0, ppdate: 0,
};


var seadata = {
    page: 1, // 页数，从1开始
    pageSize: 10, // 每页行数
    searchType: 1, // 查询类型，1为投注记录查询，2为追号查询
    statusType: 1, // 状态：1全部，2未开奖，3已中奖，4未中奖,81异常处理中
    lotteryId: getCookie('lt_lottid'), // 彩种ID
    pdate: pdate,
};


// 下拉加载
// var pageSize = 10;// 每页行数
// var page = 1;// 页数，从1开始
var restr = '';// 网页html缓存
var lock = 0;
var soyeScroll = new soyeScroll('.bet_data');
soyeScroll.init(function () {
    if (lock === 0) {
        lock = 1;
        $('.bet-recode-all')
            .append('<li style="margin: auto;text-align: center;height: 2rem;display: block;" class="so-zzjz">正在加载...</li>');
        if (index == 1) {
            seadata.searchType = 2;
            seadata.page++;
            restr = '';
            getBetRecord(); // 追号记录
        } else {
            seadata.searchType = 1;
            seadata.page++;
            restr = '';
            getBetRecord(); // 投注记录
        }
    }
});


// 菜单处理
var index = 0;
$('#tabs .item')
    .on('click', function () {
        $(this)
            .addClass('active')
            .siblings()
            .removeClass('active');

        index = $(this)
            .index();
        if (index == 1) {
            seadata.searchType = 2;
            seadata.page = 1;// 页数，从1开始
            restr = '';// 网页html缓存
            $('.tab_content')
                .html('')
                .ready(function () {
                    getBetRecord(); // 追号记录
                });
        } else {
            seadata.searchType = 1;
            seadata.page = 1;// 页数，从1开始
            restr = '';// 网页html缓存
            $('.tab_content')
                .html('')
                .ready(function () {
                    getBetRecord(); // 投注记录
                });
        }
        $('.tab_container')
            .eq(index)
            .stop(true, true)
            .fadeIn()
            .siblings()
            .stop(true, true)
            .fadeOut();
    })
    .eq(index)
    .click();

$('.tempWrap')
    .on('click', '.slide_toggle', function () {
        $(this)
            .find('.panel')
            .stop(true, true)
            .slideToggle(200);
        $(this)
            .toggleClass('active')
            .siblings()
            .removeClass('active')
            .find('.panel')
            .stop(true, true)
            .slideUp(200);
    });
//  $('.tab_content .slide_toggle:first-child').click();


/*  获取投注记录
* orderStatus,注单状态，1等待开奖,31未中奖,32已派彩,4用户撤单,5系统撤单,6中奖停追,71存在异常
* */
initView();

function initView() {
    var nowDate = new Date();
    var restr = '';
    for (var i = 0; i < 3; i++) {
        pdate = '' + (nowDate.getMonth() + 1) + '月' + nowDate.getDate() + '日';
        restr += '<li class="slide_toggle bet_day new_bet_day" data-val="' + (nowDate.getYear() + 1900) + (nowDate.getMonth() + 1) + nowDate.getDate() + '">' +
            '<div class="panel_title"> <strong class="title-data">' + pdate + '</strong><span></span> </div>' +
            '<ul class="panel bet-recode-all"></ul></li>';
        nowDate.setDate(nowDate.getDate() - 1);
    }
    $('.tab_content')
        .append(restr);
    $('.new_bet_day').on('click', function () {
        seadata.pdate = $(this).data('val');
        seadata.page++
        getBetRecord();
    });
}


function getBetRecord() {
    $.ajax({
        type: 'post',
        headers: {
            'Authorization': 'bearer ' + access_token,
        },
        dataType: 'json',
        contentType: 'application/json; charset=utf-8', // json格式传给后端
        url: action.forseti + 'api/orders/orderList',
        data: JSON.stringify(seadata), // json格式
        success: function (res) {
            console.log(res);
        },
        error: function () {
        },
    });

}

var initViewLock = 0;

// 投注记录切换标签
function recodeChange() {
    $('.recode-tab')
        .on('click', 'a', function () {
            var val = $(this)
                .data('val');
            seadata.pageSize = 10;// 每页行数
            seadata.page = 1;// 页数，从1开始
            restr = '';// 网页html缓存
            $('.tab_content')
                .html('')
                .ready(function () {
                    getBetRecord();
                });
        });
    $('.track-tab')
        .on('click', 'a', function () {
            var val = $(this)
                .data('val');
            seadata.pageSize = 10;// 每页行数
            seadata.page = 1;// 页数，从1开始
            restr = '';// 网页html缓存
            $('.tab_content')
                .html('')
                .ready(function () {
                    getBetRecord();
                });
        });
}

recodeChange();

