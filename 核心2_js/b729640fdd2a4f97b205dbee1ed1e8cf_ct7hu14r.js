let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    let func1 = extrequire("Idx3.BaseConfig.baseConfig");
    let myConfig = func1.execute();
    let hostUrl = "https://www.example.com/";
    if (tid == "hr2u8ml4" || tid == "jrp7vlmx") {
      hostUrl = myConfig.config.apiUrl;
    }
    let token = obj.token;
    let header = {
      yht_access_token: token
    };
    let params = request.reqParams;
    let apiAdderss = "/checkstock/CheckStockAutoCreateOtherOutOrder";
    apiAdderss += "?tenant_id=" + params.tenant_id;
    apiAdderss += "&lossIdString=" + params.lossIdString;
    var strResponse = postman("get", hostUrl + apiAdderss, JSON.stringify(header), null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });