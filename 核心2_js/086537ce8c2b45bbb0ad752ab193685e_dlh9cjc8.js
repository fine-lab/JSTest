let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var appKey = "yourKeyHere";
    var accessToken = "yourTokenHere";
    var date = new Date();
    //获取时间戳（10位）
    var strTime = date.getTime() + "";
    strTime = strTime.substring(0, 10);
    var oauthString = appKey + strTime + accessToken;
    var oauth = MD5Encode(oauthString);
    var requestUrl = "https://www.example.com/" + oauth + "&appKey=" + appKey + "&timestamp=" + strTime + "&clueId=2553103144603904";
    let body = {};
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let res = postman("get", requestUrl, JSON.stringify(header), JSON.stringify(body));
    let resJson = JSON.parse(res);
    let message = JSON.parse(resJson.message);
    return {
      message
    };
  }
}
exports({ entryPoint: MyAPIHandler });