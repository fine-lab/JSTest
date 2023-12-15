let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pageData = param.data[0];
    //将表单的单据审批开始日期与单据结束标识进行初始化
    var object = { id: pageData.id, approveBegin: new Date().getTime() + "", endFlag: 0, isWfControlled: "1" };
    var res = ObjectStore.updateById("GT43053AT3.GT43053AT3.riskPotCheckV1_4", object, "330f5eb7");
    return {};
  }
}
exports({ entryPoint: MyTrigger });