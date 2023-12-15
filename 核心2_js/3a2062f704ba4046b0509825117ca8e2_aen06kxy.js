let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var title = request.keyword;
    var url = "https://www.example.com/";
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = { title };
    let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });