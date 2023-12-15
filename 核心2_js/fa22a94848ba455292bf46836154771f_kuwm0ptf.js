let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { userId: request.userId };
    let url = "https://www.example.com/";
    let res = openLinker("POST", url, "GT55714AT63", JSON.stringify(body));
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });