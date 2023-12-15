let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //可以回写修改new1的值
    param.data[0].set("resAccountId", "555555555555555");
    return {};
  }
}
exports({ entryPoint: MyTrigger });