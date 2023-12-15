let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(json) {
    let appContext = AppContext();
    let obj = JSON.parse(appContext);
    let tid = obj.currentUser.tenantId;
    //获取当前租户所在数据中心gatewayUrl
    const dataCenterUrl = "https://www.example.com/" + tid;
    let strResponse = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(strResponse);
    let apiPrefix = responseJson.data.gatewayUrl;
    let apiRestPre = "https://www.example.com/";
    let olinefix = apiPrefix.replace("/iuap-api-gateway", "");
    const appCode = "GT22176AT10";
    //商开： https://sy01gsp.yonisv.com/be
    //核心1: https://stage-sy01gsp.yonisv.com/be
    //核心2：https://sy01gsp-pro.yonisv.com/be
    //核心3：https://core3-sy01gsp.yonisv.com/be
    //预发环境
    if (apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    //商开环境
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    //核心1
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    //核心2
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    //核心3
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    return { apiPrefix: apiPrefix, olinefix: olinefix, appCode: appCode, apiRestPre: apiRestPre, hostUrl: olinefix };
  }
}
exports({ entryPoint: MyTrigger });