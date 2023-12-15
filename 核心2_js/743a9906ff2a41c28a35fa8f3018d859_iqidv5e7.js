let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取业务数据
    let data = param.data[0];
    throw new Error(JSON.stringify(data));
    return {};
  }
}
exports({ entryPoint: MyTrigger });