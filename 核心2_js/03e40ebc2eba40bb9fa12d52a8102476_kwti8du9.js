let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let apptoken = "yourtokenHere";
    let appsecret = "yoursecretHere";
    //接口地址
    let url = "http://182.92.91.43:18080/datahub/FluxWmsErpYsJsonApi/";
    let method = param.method;
    let data = param.data;
    let signStr = appsecret + JSON.stringify(data) + appsecret;
    let signMD5 = MD5Encode(signStr);
    let sign = UrlEncode(Base64Encode(signMD5));
    let timestamp = getTimestamp();
    let body = {
      method: method,
      apptoken: apptoken,
      timestamp: timestamp,
      sign: sign,
      format: "json"
    };
    url = url + "?method=" + method + "&apptoken=" + apptoken + "&timestamp=" + timestamp + "&sign=" + sign + "&format=json";
    let strResponse = postman("post", url, null, JSON.stringify(data));
    let jsonResponse = JSON.parse(strResponse);
    return { jsonResponse };
    //获取当前时间戳
    function getTimestamp() {
      var d = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000);
      var year = d.getFullYear();
      var month = ("0" + (d.getMonth() + 1)).slice(-2);
      var day = ("0" + d.getDate()).slice(-2);
      var hour = ("0" + d.getHours()).slice(-2);
      var minutes = ("0" + d.getMinutes()).slice(-2);
      var seconds = ("0" + d.getSeconds()).slice(-2);
      var dateStr = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
      return dateStr;
    }
  }
}
exports({ entryPoint: MyTrigger });