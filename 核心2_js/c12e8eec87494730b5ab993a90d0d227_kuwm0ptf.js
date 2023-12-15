let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var config = {
      appkey: "yourkeyHere",
      appSecret: "yourSecretHere",
      "sandbox-openapi-url": "https://open-api-dbox.yyuap.com"
    };
    return { config };
  }
}
exports({ entryPoint: MyAPIHandler });