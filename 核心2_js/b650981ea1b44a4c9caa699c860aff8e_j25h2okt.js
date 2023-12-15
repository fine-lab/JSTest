let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return { URL: "https://c2.yonyoucloud.com" };
  }
}
exports({ entryPoint: MyTrigger });