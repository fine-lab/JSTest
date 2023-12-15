let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let price = 0;
    let productId = request.dimensions.productId;
    let token = request.accessToken;
    var queryProduct = postman("get", "https://www.example.com/" + token + "&id=" + productId + "&orgId=" + request.saleOrgId);
    let queryProductJson = JSON.parse(queryProduct);
    if (queryProductJson.code == "200") {
      request.amountUnit = queryProductJson.data.unit;
      var bodyParams = { data: new Array(request) };
      var priceResponse = postman("post", "https://www.example.com/" + token, "", JSON.stringify(bodyParams));
      var priceJson = JSON.parse(priceResponse);
    }
    return { priceJson, request, queryProduct };
  }
}
exports({ entryPoint: MyAPIHandler });