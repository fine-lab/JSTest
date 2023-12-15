let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ifUrl = "https://www.example.com/";
    let orgID = request.orgId;
    let body = { id: orgID };
    let apiRes = openLinker("GET", ifUrl, "GZTBDM", JSON.stringify(body));
    return JSON.parse(apiRes);
  }
}
exports({ entryPoint: MyAPIHandler });