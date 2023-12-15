let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1665917408780003", JSON.stringify(request.body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });