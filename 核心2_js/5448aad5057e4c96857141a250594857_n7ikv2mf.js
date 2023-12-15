let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.orgId;
    //查询组织信息
    let orgurl = "https://www.example.com/" + orgId;
    let strResponse = openLinker("GET", orgurl, "GT30661AT5", JSON.stringify({}));
    var resp = JSON.parse(strResponse);
    return resp;
  }
}
exports({ entryPoint: MyAPIHandler });