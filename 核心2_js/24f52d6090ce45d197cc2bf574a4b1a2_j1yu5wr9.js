let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var productId = request.productId;
    var orgId = request.orgid;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = { "Content-Type": contenttype };
    var tax = [];
    var productDetailURL = "https://www.example.com/" + token;
    var productDetail = postman("get", productDetailURL + "&id=" + productId + "&orgId=" + orgId, JSON.stringify(header), null);
    var productDetailObj = JSON.parse(productDetail);
    if (productDetailObj.code == "200") {
      var outTaxrateid = productDetailObj.data.detail.outTaxrate;
      var taxDetailURL = "https://www.example.com/" + token;
      var taxDetail = postman("get", taxDetailURL + "&id=" + outTaxrateid, JSON.stringify(header), null);
      var taxDetailObj = JSON.parse(taxDetail);
      if (taxDetailObj.code == "200") {
        tax.push(taxDetailObj.data.code, taxDetailObj.data.id);
        return { tax };
      }
    }
    return { tax };
  }
}
exports({ entryPoint: MyAPIHandler });