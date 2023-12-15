let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的部门信息
    let func1 = extrequire("GT14087AT2.backDefaultGroup.getdeptUserInfo");
    let res = func1.execute(request);
    var deptId = res.res.deptId;
    //根据部门id获取部门负责人
    let func2 = extrequire("GT14087AT2.backDefaultGroup.getDeptInfoByAPI");
    let deptDetail = func2.execute(deptId);
    var branchleader = { id: deptDetail.res.branchleader, name: deptDetail.res.branchleader_name };
    return { res: branchleader };
  }
}
exports({ entryPoint: MyAPIHandler });