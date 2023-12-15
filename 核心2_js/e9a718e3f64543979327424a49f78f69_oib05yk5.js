let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    param.data[0].set("tyyd", "1");
    //将枚举的值设置为1
    //保存成功后在列表上检查新增数据的枚举值
    return { param };
  }
}
exports({ entryPoint: MyTrigger });