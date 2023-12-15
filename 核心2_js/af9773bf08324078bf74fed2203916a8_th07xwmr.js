let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pageData = param.data[0];
    //将表单的单据审批开始日期与单据结束标识进行初始化
    var object = { id: pageData.id, new2: "ZXZ", isWfControlled: "1" };
    var res = ObjectStore.updateById("GT45401AT3.GT45401AT3.yx4200", object, "c6a87cb4");
    return {};
  }
}
exports({ entryPoint: MyTrigger });