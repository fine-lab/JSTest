let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    let tenant_Id = obj.currentUser.tenantId;
    let func1 = extrequire("Idx3.BaseConfig.baseConfig");
    let myConfig = func1.execute();
    let hostUrl = "https://www.example.com/";
    if (tenant_Id == "hr2u8ml4" || tenant_Id == "jrp7vlmx") {
      hostUrl = myConfig.config.apiUrl;
    }
    let token = obj.token;
    let header = {
      yht_access_token: token
    };
    let apiAdderss = "/appconfig/GetPrintConfig";
    apiAdderss += "?tenant_id=" + tenant_Id;
    var strResponse = postman("get", hostUrl + apiAdderss, JSON.stringify(header), null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });