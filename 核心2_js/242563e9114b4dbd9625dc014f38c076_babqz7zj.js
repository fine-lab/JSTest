let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    //商开环境
    var openApiDomain = "https://www.example.com/";
    var proBeDomain = "https://www.example.com/";
    if (tid != "j49ixtfv" && tid != "gkjxg2z2") {
      //生产环境
      openApiDomain = "https://www.example.com/";
      proBeDomain = "https://www.example.com/";
    }
    let onlineDomain = "https://c2.yonyoucloud.com";
    let appCode = "Iyd1";
    return { openApiDomain: openApiDomain, onlineDomain: onlineDomain, appCode: appCode, proBeDomain: proBeDomain };
  }
}
exports({ entryPoint: MyTrigger });