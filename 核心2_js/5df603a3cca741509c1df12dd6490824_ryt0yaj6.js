let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取当前实体
    var thisdata = param.data[0];
    return {};
  }
}
exports({ entryPoint: MyTrigger });