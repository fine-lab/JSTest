let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var config = {
      appKey: "yourKeyHere",
      appSecret: "yourSecretHere",
      baseurl: "https://c2.yonyoucloud.com"
    };
    return { config };
  }
}
exports({ entryPoint: MyTrigger });