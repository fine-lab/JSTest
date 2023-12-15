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
    let apiAdderss = "/checkstock/GetCheckDiffList";
    apiAdderss += "?tenant_id=" + params.tenant_id;
    apiAdderss += "&userId=" + params.userId;
    apiAdderss += "&org_id=" + params.org_id;
    apiAdderss += "&checkCode=" + params.checkCode;
    apiAdderss += "&locationname=" + params.locationname;
    apiAdderss += "&status=" + params.status;
    apiAdderss += "&checkstatus=" + params.checkstatus;
    apiAdderss += "&page=" + params.page;
    apiAdderss += "&pagesize=" + params.pagesize;
    var strResponse = postman("get", hostUrl + apiAdderss, JSON.stringify(header), null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });