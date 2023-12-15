let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取微信用户openid
    var code = request.code;
    //艾蕾
    var flagsale = request.flagsale;
    var appid = "youridHere";
    var secret = "yoursecretHere";
    if (flagsale == 1) {
      //山西米粒
      appid = "youridHere";
      secret = "yoursecretHere";
    } else if (flagsale == 2) {
      //艾蕾  YonSuite客户自助
      appid = "youridHere";
      secret = "yoursecretHere";
    }
    var strResponse = postman(
      "get",
      "https://www.example.com/" + appid + "&secret=" + secret + "&grant_type=authorization_code" + "&js_code=" + URLEncoder(code),
      null,
      null
    );
    //周的
    //宋的
    //测试
    //正式
    var openid = JSON.parse(strResponse).openid;
    if (openid === null || openid === undefined) {
      throw new Error(strResponse);
    }
    return { openid: openid };
  }
}
exports({ entryPoint: MyAPIHandler });