let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let awardParams = request.awardParams;
    // 部门预算
    let funcUpdDept = extrequire("AT165369EC09000003.apifunc.UpdDeptScore");
    let resUpdDept1 = funcUpdDept.execute(awardParams);
    if (resUpdDept1.result != "0") {
      return resUpdDept1;
    }
    // 勋章颁发记录
    let funcUpdAward = extrequire("AT165369EC09000003.apifunc.UpdAwardRecord");
    let resUpdAward = funcUpdAward.execute(awardParams);
    if (resUpdAward.result != "0") {
      return resUpdAward;
    }
    // 个人信息
    let funcUpdStaff = extrequire("AT165369EC09000003.apifunc.UpdStaffData");
    let resUpdStaff = funcUpdStaff.execute(awardParams);
    if (resUpdStaff.result != "0") {
      return resUpdStaff;
    }
    return { result: "0", message: "操作成功" };
  }
}
exports({ entryPoint: MyAPIHandler });