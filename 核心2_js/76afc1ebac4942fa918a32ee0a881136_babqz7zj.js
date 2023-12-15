let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取Tenant_id
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    let configFun = extrequire("IDX_02.myConfig.baseConfig");
    let config = configFun.execute(request);
    let baseUrl = config.config.apiUrl;
    // 获取Token
    let func1 = extrequire("IDX_02.myConfig.cusToken");
    let resToken = func1.execute(request);
    let jsonToken = JSON.parse(resToken.strResponse);
    let myToken = jsonToken.access_token;
    let locationId = request.locationId;
    var strResponse = postman("get", baseUrl + "/location/GetLocationNumByParentId?access_token=" + myToken + "&locationId=" + "&tenant_id=" + tid, null, null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });