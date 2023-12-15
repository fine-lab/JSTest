let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var url = "https://www.example.com/";
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = { fields: [] };
    var strResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });