let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var strResponse = postman("get", "https://www.example.com/", null, null);
    var str = JSON.stringify(strResponse);
    return { res: str };
  }
}
exports({ entryPoint: MyAPIHandler });