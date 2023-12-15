let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    var strResponse = postman("get", url + URLEncoder(request.tenantId), null, null);
    let result = JSON.parse(strResponse);
    let gatewayUrl = result.data.gatewayUrl;
    let tokenUrl = result.data.tokenUrl;
    request.gatewayUrl = gatewayUrl;
    request.tokenUrl = tokenUrl;
    let func1 = extrequire("GT1479AT24.common.getToken");
    let res = func1.execute(request);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });