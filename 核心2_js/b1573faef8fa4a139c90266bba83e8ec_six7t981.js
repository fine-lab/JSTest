let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    let tid = obj.currentUser.tenantId;
    let func1 = extrequire("Idx3.BaseConfig.baseConfig");
    let myConfig = func1.execute();
    let hostUrl = "https://www.example.com/";
    if (tid == "hr2u8ml4" || tid == "jrp7vlmx") {
      hostUrl = myConfig.config.apiUrl;
    }
    let params = request.reqParams;
    let token = obj.token;
    let header = {
      yht_access_token: token
    };
    let body = {
      epcprelist: params.dataList
    };
    let apiAdderss = "/epclist/SubmitEpclist";
    apiAdderss += "?tenant_id=" + params.tenant_id;
    apiAdderss += "&modifier=" + params.userId;
    apiAdderss += "&ordertype=" + params.ordertype;
    apiAdderss += "&flagdebug=true";
    var strResponse = postman("post", hostUrl + apiAdderss, JSON.stringify(header), JSON.stringify(body));
    var bodyJson = JSON.stringify(body);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });