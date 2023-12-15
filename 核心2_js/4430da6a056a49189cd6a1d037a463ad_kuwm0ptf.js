let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let strResponse = postman("get", "http://39.106.84.51:8001/testapi.do");
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });