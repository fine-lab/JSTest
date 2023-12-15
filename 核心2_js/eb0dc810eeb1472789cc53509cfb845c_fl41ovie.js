let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var address = request.address;
    var strResponse = postman("get", "https://www.example.com/" + address + "&output=json&ak=E2l533GlndgsDjXhoZNUi7FG6u0fhDwo", null, null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });