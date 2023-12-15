let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //创建获取服务端数据proxy对象
    return {};
  }
}
exports({ entryPoint: MyTrigger });