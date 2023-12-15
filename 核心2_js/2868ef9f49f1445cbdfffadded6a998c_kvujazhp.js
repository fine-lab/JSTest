let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let taxrate = 13;
    let func1 = extrequire("GT6923AT3.checkOrderBe.getAccessToken");
    let res = func1.execute(null, null);
    let token = res.access_token;
    let productId = request.productId;
    let saleOrgId = request.saleOrgId;
    var queryProduct = postman("get", "https://www.example.com/" + token + "&id=" + productId + "&orgId=" + saleOrgId);
    let queryProductJson = JSON.parse(queryProduct);
    if (queryProductJson.code == "200") {
      taxrate = queryProductJson.data.detail.outTaxrate_Name;
    }
    return { taxrate };
  }
}
exports({ entryPoint: MyAPIHandler });