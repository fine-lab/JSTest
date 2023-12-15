let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = request.param;
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1957625017480008", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });