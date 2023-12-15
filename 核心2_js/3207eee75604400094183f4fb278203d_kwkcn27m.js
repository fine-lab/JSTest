let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var config = {
      appId: "yourIdHere",
      appkey: "yourkeyHere",
      appSecret: "yourSecretHere",
      baseApiUrl: "https://api.diwork.com"
    };
    return { config };
  }
}
exports({ entryPoint: MyAPIHandler });