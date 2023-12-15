let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var materid = request.materialid;
    var productApplyRangeId = request.productApplyRangeId;
    var token = "";
    let func1 = extrequire("GT46349AT1.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    let base_path = "https://www.example.com/" + token + "&id=" + materid + "&orgId=" + productApplyRangeId;
    var strResponse = postman("GET", base_path, null);
    var responseObj = JSON.parse(strResponse);
    var deptDetail;
    if ("200" == responseObj.code) {
      deptDetail = responseObj.data;
    } else {
      throw new Error("错误" + responseObj.message);
    }
    var materialnew = responseObj.data.id;
    var fMarkPrice = responseObj.data.detail.fMarkPrice;
    var defaultSKUId = responseObj.data.defaultSKUId;
    var fNoTaxCostPrice = responseObj.data.detail.fNoTaxCostPrice;
    return { materialnew: materialnew, fMarkPrice: fMarkPrice, request: request, defaultSKUId: defaultSKUId, fNoTaxCostPrice: fNoTaxCostPrice };
  }
}
exports({ entryPoint: MyAPIHandler });