const ENV_KEY = "yourKEYHere";
const ENY_SEC = "14b19c4d2c0746aa912a6e4146a57a7f";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let str = request.data;
    var apiResponse = "s";
    apiResponse = ublinker("get", "https://www.example.com/", HEADER_STRING, null);
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });