let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    throw new Error("111"); //JSON.stringify(param));
    return {};
  }
}
exports({ entryPoint: MyTrigger });