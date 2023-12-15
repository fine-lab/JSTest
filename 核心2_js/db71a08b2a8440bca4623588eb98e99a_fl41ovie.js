let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的部门信息
    let func1 = extrequire("GT13576AT142.userinfo.getdeptUserInfo");
    let res = func1.execute(request);
    var deptId = res.res.deptId;
    //根据部门id获取部门负责人
    let func2 = extrequire("GT13576AT142.userinfo.getDeptInfoByAPI");
    let deptDetail = func2.execute(deptId);
    var branchleader = { id: deptDetail.res.principal, name: deptDetail.res.principal_name };
    //获取部门负责人邮箱
    let func3 = extrequire("GT13576AT142.userinfo.getPsnInfo");
    var psnE = func3.execute(deptDetail.res.principal);
    var branchleader = { id: deptDetail.res.principal, name: deptDetail.res.principal_name, email: psnE.res.email };
    return { res: branchleader };
  }
}
exports({ entryPoint: MyAPIHandler });