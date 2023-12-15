let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var timezone = 8; //目标时区时间，东八区
    // 本地时间和格林威治的时间差，单位为分钟
    var offset_GMT = new Date().getTimezoneOffset();
    // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var nowDate = new Date().getTime();
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    // 当前日期时间戳
    var expDate = new Date(date);
    let Year = expDate.getFullYear();
    let Moth = expDate.getMonth() + 1 < 10 ? "0" + (expDate.getMonth() + 1) : expDate.getMonth() + 1;
    let Day = expDate.getDate() < 10 ? "0" + expDate.getDate() : expDate.getDate();
    let Hour = expDate.getHours() < 10 ? "0" + expDate.getHours() : expDate.getHours();
    let Minute = expDate.getMinutes() < 10 ? "0" + expDate.getMinutes() : expDate.getMinutes();
    let Sechond = expDate.getSeconds() < 10 ? "0" + expDate.getSeconds() : expDate.getSeconds();
    // 到期日期
    var expireDate = Year + "-" + Moth + "-" + Day + " " + Hour + ":" + Minute + ":" + Sechond;
    return { expireDate };
  }
}
exports({ entryPoint: MyTrigger });