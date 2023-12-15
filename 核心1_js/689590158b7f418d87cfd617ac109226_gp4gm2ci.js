let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let appId = "10";
    let appSecret = "yourSecretHere";
    let timestamp = new Date().getTime();
    let sign = MD5Encode(timestamp + appId + appSecret);
    let body = {};
    let header = { timestamp: timestamp, sign: sign };
    let strResponse = postman("post", "https://www.example.com/" + appId, JSON.stringify(header), JSON.stringify(body));
    return { body, strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });