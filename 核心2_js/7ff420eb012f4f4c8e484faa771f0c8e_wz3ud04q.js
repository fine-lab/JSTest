let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(json) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    //沙箱环境
    var apiPrefix = "https://www.example.com/";
    var apiRestPre = "https://www.example.com/";
    if (tid != "x5f9yw7w" && tid != "zpnb3dru" && tid != "au2m4621" && tid != "fdk2u4ol") {
      //生产环境
      apiPrefix = "https://www.example.com/";
      apiRestPre = "https://www.example.com/";
    }
    let olinefix = "https://c2.yonyoucloud.com";
    let appCode = "ISVUDI";
    return { apiPrefix: apiPrefix, olinefix: olinefix, appCode: appCode, apiRestPre: apiRestPre };
  }
}
exports({ entryPoint: MyTrigger });