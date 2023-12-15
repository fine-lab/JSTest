let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.orgId;
    //查询组织信息
    let func1 = extrequire("GT18952AT11.zzsq.getToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    var strResponse = postman("get", "https://www.example.com/" + token + "&id=" + orgId, null, null);
    var resp = JSON.parse(strResponse);
    return resp;
  }
}
exports({ entryPoint: MyAPIHandler });