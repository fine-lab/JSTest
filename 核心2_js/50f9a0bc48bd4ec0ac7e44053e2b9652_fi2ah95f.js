let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取表单中的相关数据
    let pageFormData = param.data[0];
    throw new Error(JSON.stringify(pageFormData));
    return {};
  }
}
exports({ entryPoint: MyTrigger });