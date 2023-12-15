let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(json) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    //沙箱环境
    var apiPrefix = "https://open-api-dbox.yyuap.com";
    var apiRestPre = "https://www.example.com/";
    if (tid != "x5f9yw7w") {
      //生产环境
      apiPrefix = "https://www.example.com/";
      apiRestPre = "https://www.example.com/";
    }
    let olinefix = "https://c2.yonyoucloud.com";
    let appCode = "GT22176AT10";
    return { apiPrefix: apiPrefix, olinefix: olinefix, appCode: appCode, apiRestPre: apiRestPre };
  }
}
exports({ entryPoint: MyTrigger });