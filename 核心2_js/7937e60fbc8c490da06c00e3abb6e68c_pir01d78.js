let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取审批人列表
    let func1 = extrequire("GT63636AT30.ceshi001.getLCSPR");
    let res = func1.execute(param.data[0], param.billnum);
    //保存前更改参数
    param.data[0].set(res.billsaveparams, res.res);
    return {};
  }
}
exports({ entryPoint: MyTrigger });