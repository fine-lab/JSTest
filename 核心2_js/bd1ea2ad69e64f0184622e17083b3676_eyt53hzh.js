let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 时间格式化方法
    var dateFormat = function (date, format) {
      date = new Date(date);
      var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "H+": date.getHours() + 8, //hour+8小时
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      };
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return format;
    };
    // 获取当前任务的租户ID
    var tenantid = context.tenantid;
    //沙箱环境
    var apiRestPre = "https://www.example.com/";
    if (tenantid != "x5f9yw7w") {
      //生产环境
      apiRestPre = "https://www.example.com/";
    }
    var salt = "|fb4f91ab_2663738529976576|";
    // 时间戳，精确到分钟
    var timestampStr = dateFormat(new Date(), "yyyy-MM-dd HH:mm");
    //为防止被攻击，添加签名校验
    var objstr = tenantid + salt + timestampStr;
    var sign = MD5Encode(objstr);
    // 拼装请求报文
    var obj = { tenantId: tenantid, logId: "test", time: timestampStr, uuid: sign };
    //获取api前缀等信息 参数： 请求方式 ， 地址  ，header ， body
    var strResponse = postman("post", apiRestPre + "/task/syncClosedProduct", null, JSON.stringify(obj));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });