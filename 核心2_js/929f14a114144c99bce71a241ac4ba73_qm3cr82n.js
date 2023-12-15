let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    postman("GET", "https://www.example.com/", null, null);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });