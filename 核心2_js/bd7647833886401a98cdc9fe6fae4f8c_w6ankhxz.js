let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return { url: "http://yonyou.free.idcfengye.com" };
  }
}
exports({ entryPoint: MyTrigger });