let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = request.body;
    throw new error(JSON.stringify(body));
    let url = "https://www.example.com/";
    let apiResponse = apiman("post", url, null, JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });