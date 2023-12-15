let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 少收清算任务
    LessLiquidationFunction();
    return {};
  }
}
exports({ entryPoint: MyTrigger });