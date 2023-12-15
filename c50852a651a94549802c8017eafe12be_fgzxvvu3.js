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
    //沙箱环境
    let apiRestPre = "https://www.example.com/";
    if (tid != "x5f9yw7w" && tid != "zpnb3dru" && tid != "au2m4621" && tid != "kegf1e24") {
      //生产环境
      apiRestPre = "https://www.example.com/";
    }
    //灰度
    if (tid == "fgzxvvu3") {
      apiRestPre = "https://www.example.com/";
    }
    let olinefix = apiPrefix.replace("/iuap-api-gateway", "");
    const appCode = "GT22176AT10";
    return { apiPrefix: apiPrefix, olinefix: olinefix, appCode: appCode, apiRestPre: apiRestPre, hostUrl: olinefix };
  }
}
exports({ entryPoint: MyTrigger });