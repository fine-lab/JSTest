let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 调出单数据
  }
}
exports({ entryPoint: MyTrigger });