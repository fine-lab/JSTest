let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //如果不是ebs调用的则什么都不干
    return {};
  }
}
exports({ entryPoint: MyTrigger });