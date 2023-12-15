let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取微信用户openid
    var code = request.code;
    //艾蕾 wx6bd3691b7beb4564
    var strResponse = postman(
      "get",
      "https://www.example.com/" + URLEncoder(code),
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