let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.body;
    let url = "https://www.example.com/";
    var accept = postman("post", url, null, JSON.stringify(data));
    var res = JSON.parse(accept).data;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });