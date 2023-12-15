let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var config = {
      appKey: "yourKeyHere",
      appSecret: "yourSecretHere",
      baseUrl: "https://yonbip.diwork.com",
      updateJiraUrl: "/qyic8c7o/commonProductCls/commonProduct/updateJira"
    };
    return { config };
  }
}
exports({ entryPoint: MyTrigger });