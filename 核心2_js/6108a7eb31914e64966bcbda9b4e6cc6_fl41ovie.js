let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sysId = "yourIdHere";
    var tenantId = request.tid;
    var userids = [request.uid];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    result = JSON.parse(result).data[request.uid];
    //获取部门负责人信息
    let func2 = extrequire("GT13576AT142.userinfo.getdeptLeaders");
    let deptDetail = func2.execute(result.deptId);
    result.principal_name = deptDetail.res.name;
    result.principal = deptDetail.res.id;
    //获取部门负责人邮箱
    let func3 = extrequire("GT13576AT142.userinfo.getPsnInfo");
    let psnE = func3.execute(result.principal);
    result.principal_email = psnE.res.email;
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });