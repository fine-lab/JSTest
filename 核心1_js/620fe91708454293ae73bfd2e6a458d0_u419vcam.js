let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 缺交清算任务
    LackLiquidationFunction();
    return {};
  }
}
exports({ entryPoint: MyTrigger });