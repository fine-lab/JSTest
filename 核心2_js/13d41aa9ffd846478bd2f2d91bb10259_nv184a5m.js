let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(json) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    //沙箱环境
    var apiPrefix = "https://www.example.com/";
    var apiRestPre = "https://www.example.com/";
    const dataCenterUrl = "https://www.example.com/" + tid;
    let strResponse = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(strResponse);
    let gatewayUrl = responseJson.data.gatewayUrl;
    if (gatewayUrl != "https://www.example.com/") {
      //生产环境
      apiPrefix = "https://www.example.com/";
      apiRestPre = "https://www.example.com/";
    }
    let olinefix = "https://c2.yonyoucloud.com";
    let appCode = "I0P_UDI";
    return { apiPrefix: apiPrefix, olinefix: olinefix, appCode: appCode, apiRestPre: apiRestPre };
  }
}
exports({ entryPoint: MyTrigger });