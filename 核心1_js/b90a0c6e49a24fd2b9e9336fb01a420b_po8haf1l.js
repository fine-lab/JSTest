let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    var data = {};
    data.sns = request.cSN;
    data._status = "Update";
    let body = { data: data, _status: "Update" };
    let header = {};
    let apiResponse = openLinker("post", buzUrl + "/po8haf1l/crmApi/coupon/pt_couponreceivelist/abandon/v1", "SDMB", JSON.stringify(body));
    var res = replace(apiResponse, "flag", "code");
    var res1 = replace(res, ":1", ":200");
    apiResponse = res1;
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });