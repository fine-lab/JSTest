let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var result = { gatewayUrl: "https://www.example.com/", tokenUrl: "https://www.example.com/" };
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });