let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let deptId = param.variablesMap.deptId;
    let matrixLevel = "A3";
    //一级机构财务总监
    let func1 = extrequire("GT3407AT1.flow.getApprover"); //(context,param,deptId,matrixLevel)
    let res = func1.execute(deptId, matrixLevel);
    if (!res) {
      res = func1.execute(deptId, "A2");
    }
    return res;
  }
}
exports({ entryPoint: MyTrigger });