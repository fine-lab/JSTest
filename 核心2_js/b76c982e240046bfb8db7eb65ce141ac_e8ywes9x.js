let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var resp = postman("get", "https://www.example.com/", null, null);
    return { resp };
  }
}
exports({ entryPoint: MyAPIHandler });