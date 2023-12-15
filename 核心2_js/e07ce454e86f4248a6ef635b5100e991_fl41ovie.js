let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var strResponse = postman("get", "https://www.baidu.com", null, null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });