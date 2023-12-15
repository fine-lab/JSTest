let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    // 全局配置加载
    var myConfig = null;
    if (typeof request.reqParams.myConfig != "undefined") {
      myConfig = request.reqParams.myConfig;
    }
    if (myConfig == null) throw new Error("全局配置加载异常");
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
    try {
      let func1 = extrequire("Idx3.BaseConfig.baseConfig");
      return { strResponse, func1 };
    } catch (e) {
      return { strResponse, func1: "extrequire方法异常" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });