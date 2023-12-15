let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let a = { a: request };
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let url = "https://www.example.com/";
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(a));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });