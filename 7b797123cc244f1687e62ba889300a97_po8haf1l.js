let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sql = "select * from 	pc.product.Product where code = '" + request.code + "'";
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    if (res.length < 1) {
      return {};
    }
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    let body = {};
    let header = {};
    var apiResponse = openLinker("get", buzUrl + "/yonbip/digitalModel/product/detail?id=" + res[0].id + "&orgId=" + request.orgId, "AT19FB439016C80004", JSON.stringify(body));
    console.log(apiResponse);
    return JSON.parse(apiResponse);
  }
}
exports({ entryPoint: MyAPIHandler });