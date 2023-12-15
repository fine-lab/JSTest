let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var timeStamp = request.timeStamp;
    var appId = request.appId;
    var appSystem = request.appSystem;
    var sign = request.sign;
    var args = request.args;
    let body = { AppId: appId, Timestamp: timeStamp, Sign: sign, Args: args, AppSystem: appSystem };
    let header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    let url = "https://www.example.com/";
    var strResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });