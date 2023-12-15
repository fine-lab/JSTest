let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(json) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    //沙箱环境
    var apiRestPre = "https://www.example.com/";
    var gspApiRestPre = "https://www.example.com/";
    const dataCenterUrl = "https://www.example.com/" + tid;
    let strResponse = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(strResponse);
    let apiPrefix = responseJson.data.gatewayUrl;
    //默认沙箱环境
    //商开环境
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      gspApiRestPre = "https://www.example.com/";
      apiRestPre = "https://www.example.com/";
    }
    //核心1
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    //核心2
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      gspApiRestPre = "https://www.example.com/";
      apiRestPre = "：https://pro-iud1.yonisv.com/be";
    }
    //核心3
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      gspApiRestPre = "https://www.example.com/";
      apiRestPre = "https://www.example.com/";
    }
    let olinefix = "https://yonbip.diwork.com";
    let appCode = "I0P_UDI";
    return { apiPrefix: apiPrefix, olinefix: olinefix, appCode: appCode, apiRestPre: apiRestPre, gspApiRestPre: gspApiRestPre, tenantId: tid };
  }
}
exports({ entryPoint: MyTrigger });