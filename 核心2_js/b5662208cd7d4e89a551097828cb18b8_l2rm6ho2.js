let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = JSON.parse(param.data); //获取数据
    return { result: data };
  }
}
exports({ entryPoint: MyTrigger });