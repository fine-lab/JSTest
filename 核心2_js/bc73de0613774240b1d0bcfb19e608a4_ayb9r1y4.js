let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取到应有的金额进行计算；
    return {};
  }
}
exports({ entryPoint: MyTrigger });