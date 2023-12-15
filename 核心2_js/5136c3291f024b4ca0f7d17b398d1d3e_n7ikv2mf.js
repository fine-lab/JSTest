let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.orgId;
    let url = "https://www.example.com/" + orgId;
    let resp = openLinker("GET", url, "GT30660AT4", JSON.stringify({}));
    return JSON.parse(resp);
  }
}
exports({ entryPoint: MyAPIHandler });