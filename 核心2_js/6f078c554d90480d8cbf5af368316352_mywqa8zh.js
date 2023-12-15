let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = request.id;
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    var strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });