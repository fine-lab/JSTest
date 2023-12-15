let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.orgId;
    //查询组织信息
    let func1 = extrequire("GT30659AT3.backDefaultGroup.getAccessToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    let url = "https://www.example.com/" + orgId;
    let apiResponse = openLinker("GET", url, "GT30659AT3", JSON.stringify({}));
    var resp = JSON.parse(apiResponse);
    return resp;
  }
}
exports({ entryPoint: MyAPIHandler });