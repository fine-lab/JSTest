let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configFun = extrequire("IDX_02.myConfig.baseConfig");
    let config = configFun.execute(request);
    let baseUrl = config.config.baseUrl;
    baseUrl = "https://www.example.com/";
    let func1 = extrequire("IDX_02.myConfig.getTokenApi");
    let resToken = func1.execute(request);
    let myToken = resToken.access_token;
    let locationId = request.locationId;
    var strResponse = postman("get", baseUrl + "/location/GetLocationNumByParentId?access_token=" + myToken + "&locationId=" + locationId, null, null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });