let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let appId = "10";
    let appSecret = "yourSecretHere";
    let timestamp = new Date().getTime();
    let sign = MD5Encode(timestamp + appId + appSecret);
    let body = { timestamp, sign, appId };
    let header = {};
    let strResponse = postman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return { body, strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });