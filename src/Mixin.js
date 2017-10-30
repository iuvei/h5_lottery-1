

//代码调用示例
// this.getSystemTime().then((sys_time)=>{
//     //代码
// })

//mixin.js
var MyMixin = {
    data:function(){
        return {
            // access_token:' ', 
        }
    },
    methods:{

        //格式化赔率
        payoffFormat(val){
            return (Number(val)/10000).toFixed(3);
        },
        /* 获取系统时间，lotteryid 彩种id moved to /src/Maxin.js
            调用方式
                this.getSystemTime([lotteryid]).then((sys_time)=>{
                    //代码
                })
        */
        getSystemTime(lotteryid) { 
            return new Promise((resolve, reject)=>{
                $.ajax({
                    type: 'get',
                    headers: {
                        "Authorization": "bearer  " + this.getAccessToken(access_token),
                    },
                    url: action.forseti + 'apis/serverCurrentTime',
                    data: {},
                    success: (res) => {
                        sys_time = this.formatTimeUnlix(res.data);
                        resolve(sys_time);
                        // priodDataNewly(lotteryid); // 最近5期开奖，获取系统时间后再调用  

                    },
                    error: function () {

                    }
                });

            })
        },

        // token 处理
        getAccessToken(access_token) {
            if (access_token && access_token.length > 10) {
                // console.log(access_token)
                return access_token;
            } else {
                // console.log('从cookie');
                var tmp = this.getCookie("access_token");
                return tmp;
            }

        },

        // 时间戳转换
        formatTimeUnlix (v) {
            if (v == null) {
                return '';
            }
            var date = new Date(v);
            var year = date.getFullYear();
            var month = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
            var day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
            var hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
            var minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
            var seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        },

        /*
         * 数字转千分位
         * */
        formatNumber (num) {
            return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        },

        /*
         * 还原金额，去除逗号
         * */
        returnMoney(s) {
            return parseFloat(s.replace(/[^\d\.-]/g, ""));
        },

        /*
         *  正整数判断，不包含零
         * */

         isPositiveNum(num) {
            //  var re = /^[0-9]*[1-9][0-9]*|0$/ ;
            var re=/^[0-9]*$/;
            return re.test(num);
        },


        /**
         * 解析URL参数
         */
        getStrParam () {
            var url = location.search; // 获取url中"?"符后的字串
            var param = {};
            if (url.indexOf('?') != -1) {
                var str = url.substr(1);
                strs = str.split('&');
                for (var i = 0; i < strs.length; i++) {
                    param[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1]);
                }
            }
            return param;
        },

        // 设置cookie
        setCookie (name, value, expire, path) {
            var curdate = new Date();
            var cookie = name + '=' + encodeURIComponent(value) + '; ';
            if (expire != undefined || expire == 0) {
                if (expire == -1) {
                    expire = 366 * 86400 * 1000;// 保存一年
                } else {
                    expire = parseInt(expire);
                }
                curdate.setTime(curdate.getTime() + expire);
                cookie += 'expires=' + curdate.toUTCString() + '; ';
            }
            path = path || '/';
            cookie += 'path=' + path;
            document.cookie = cookie;
        },

        // 获取cookie
        getCookie (name) {
            var re = '(?:; )?' + encodeURIComponent(name) + '=([^;]*);?';
            re = new RegExp(re);
            if (re.test(document.cookie)) {
                return decodeURIComponent(RegExp.$1);
            }
            return '';
        },
        getName(){
            return this.name;
        },
        // 金额转换,分转成元
        roundAmt(v) {
            return isNaN(v) ? '0.00' : (v / 100).toFixed(2);
        },

        // 金额转换，支持实数, 元转成分
        monAmt (v) {
            return /^[-+]?\d+(\.\d*)?$/.test(v) ? v * 100 : '';
        },

        /*
         * 数字转换，显示千位符，s 要转换的数字，n 保留n位小数
         * */
        fortMoney (s, n) {
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1];
            let t = "";
            for(let i = 0; i < l.length; i ++ ){
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
        }
    }
};
export default MyMixin;
