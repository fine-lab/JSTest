let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var materid = request.materialid;
    var productApplyRangeId = request.productApplyRangeId;
    var token = "";
    let func1 = extrequire("GT50937AT1.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    var currentUser = JSON.parse(AppContext()).currentUser;
    var orgId = currentUser.orgId;
    let base_path = "https://www.example.com/" + token + "&id=" + materid + "&orgId=" + orgId;
    var strResponse = postman("GET", base_path, null);
    var responseObj = JSON.parse(strResponse);
    var deptDetail;
    if ("200" == responseObj.code) {
      deptDetail = responseObj.data;
    } else {
      throw new Error("错误" + responseObj.message);
    }
    var defaultSKUId = responseObj.data.productskus;
    return { request: request, defaultSKUId: defaultSKUId };
  }
}
exports({ entryPoint: MyAPIHandler });