let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var userids = obj.currentUser.id;
    let func1 = extrequire("SCMSA.CommonFunction.baseConfig");
    let myConfig = func1.execute();
    let hostUrl = "https://www.example.com/";
    if (tid == "hr2u8ml4") {
      hostUrl = myConfig.config.apiUrl;
    }
    var strResponse = postman("get", hostUrl + "/public/getAccessToken?tenant_id=" + tid, null, null);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });