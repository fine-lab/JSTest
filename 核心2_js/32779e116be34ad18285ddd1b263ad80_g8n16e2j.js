let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取审批人列表
    let func1 = extrequire("GT16037AT2.process.getProcessApproveP");
    let res = func1.execute(param.data[0], param.billnum);
    //保存前更改参数
    param.data[0].set(res.billSaveParams, res.res);
    return {};
  }
}
exports({ entryPoint: MyTrigger });