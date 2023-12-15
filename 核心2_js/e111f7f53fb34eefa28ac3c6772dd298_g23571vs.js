let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取销售订单详情
  }
}
exports({ entryPoint: MyTrigger });