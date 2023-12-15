let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let deptId = param.variablesMap.deptId;
    let matrixLevel = "D4";
    //二级部门总经理
    let func1 = extrequire("GT3407AT1.flow.getApprover"); //(context,param,deptId,matrixLevel)
    let res = func1.execute(deptId, matrixLevel);
    return res;
  }
}
exports({ entryPoint: MyTrigger });