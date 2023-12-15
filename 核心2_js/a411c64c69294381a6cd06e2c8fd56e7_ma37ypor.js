let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let staffUrl = "https://www.example.com/";
    let userID = request.userId;
    let body = { id: userID };
    let apiRes = openLinker("POST", staffUrl, "HRED", JSON.stringify(body));
    return JSON.parse(apiRes);
  }
}
exports({ entryPoint: MyAPIHandler });