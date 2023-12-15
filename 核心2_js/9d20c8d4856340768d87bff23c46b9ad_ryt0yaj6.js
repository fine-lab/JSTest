let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var materid = request.materialid;
    var orgid = request.orgid;
    var token = "";
    let func1 = extrequire("GT64173AT6.backDefaultGroup.getmattokken");
    let res = func1.execute(request);
    token = res.access_token;
    let base_path = "https://www.example.com/" + token + "&id=" + materid + "&orgId=" + orgid;
    var strResponse = postman("GET", base_path, null);
    var responseObj = JSON.parse(strResponse);
    var deptDetail;
    if ("200" == responseObj.code) {
      deptDetail = responseObj.data;
    } else {
      throw new Error("错误" + responseObj.message);
    }
    var defaultSKUId = responseObj.data.defaultSKUId;
    return { request: request, defaultSKUId: defaultSKUId, resdata: responseObj.data }; //
  }
}
exports({ entryPoint: MyAPIHandler });