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
    var appcontext = JSON.parse(AppContext());
    var currentuser = appcontext.currentUser;
    var userId = currentuser.id;
    const dataCenterUrl = "https://www.example.com/" + tenantid;
    let gatewayUrl = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(gatewayUrl);
    let apiPrefix = responseJson.data.gatewayUrl;
    //沙箱环境
    var apiRestPre = "https://www.example.com/";
    if (apiPrefix != "https://www.example.com/") {
      //生产环境
      apiRestPre = "https://www.example.com/";
    }
    //灰度
    if (tenantid == "fgzxvvu3" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    // 拼装请求报文
    var obj = { tenantId: tenantid, userId: userId };
    //获取api前缀等信息 参数： 请求方式 ， 地址  ，header ， body
    var strResponse = postman("post", apiRestPre + "/gsp/gmpTmpToTime", null, JSON.stringify(obj));
    return { strResponse };
    //查询未处理的临时证照
    return {};
  }
}
exports({ entryPoint: MyTrigger });