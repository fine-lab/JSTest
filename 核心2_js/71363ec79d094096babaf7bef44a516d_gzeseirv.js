let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var config = {
      appKey: "yourKeyHere",
      appSecret: "yourSecretHere",
      baseUrl: "https://api.diwork.com"
    };
    return { config };
  }
}
exports({ entryPoint: MyAPIHandler });