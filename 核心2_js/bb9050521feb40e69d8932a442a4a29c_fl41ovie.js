let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 实体数据
    var object = { name: "张三", age: "22", address: "三里屯" };
    // 保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
    var res = ObjectStore.insert("GT65596AT295.GT65596AT295.zs_student", object, "9c70f1b9");
    return { res };
  }
}
exports({ entryPoint: MyTrigger });