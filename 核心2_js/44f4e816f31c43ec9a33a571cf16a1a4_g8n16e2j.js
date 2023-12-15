let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request, billnum) {
    let result = [];
    //获取当前登录人员工信息
    let func1 = extrequire("GT16037AT2.process.getCurrentStaffInfo");
    let userInfo = func1.execute(request);
    if (null == userInfo || userInfo.length == 0) throw new Error("当前登录人没有员工信息");
    result.push(userInfo.res.id);
    //获取审批人配置信息
    let func3 = extrequire("GT16037AT2.process.getProcessConfigure");
    let processP = func3.execute(billnum);
    //添加主流程审批人
    if (processP.mainR.length > 0) {
      result = result.concat(processP.mainR);
    }
    //判断子流程条件
    if (processP.chR.length > 0) {
      let funch = extrequire("GT16037AT2.process.foreach");
      let processPch = funch.execute(processP.chR, request);
      result = result.concat(processPch.ch);
    }
    //获取上级部门领导-----判断是否启用
    if (processP.formula == "1") {
      let func2 = extrequire("GT16037AT2.process.getCurrentDeptLeader");
      let deptLeader = func2.execute(request);
      var leader = [deptLeader.res.id];
      result = result.concat(leader);
    }
    return { res: result.toString(), billSaveParams: processP.billSaveParams };
  }
}
exports({ entryPoint: MyAPIHandler });