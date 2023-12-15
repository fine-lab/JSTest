let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //去当前时间
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    let year = date.getFullYear();
    var month = date.getMonth() + 1; // 获取月
    var strDate = date.getDate(); // 获取日
    var hour = date.getHours(); // 获取小时
    var minute = date.getMinutes(); // 获取分钟
    var second = date.getSeconds();
    if (month < 10) {
      month = "0" + month;
    }
    if (strDate < 10) {
      strDate = "0" + strDate;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (second < 10) {
      second = "0" + second;
    }
    date = year + "-" + month + "-" + strDate + " " + hour + ":" + minute + ":" + second;
    return { date };
  }
}
exports({ entryPoint: MyAPIHandler });