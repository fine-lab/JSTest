let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = "coop_area_admin";
    let code1 = "authAdmin";
    let userId = request.userId;
    let roleInfo = null;
    let roleInfo1 = null;
    let roleId = null;
    let roleId1 = null;
    // 获取当前角色用户信息
    let func1 = extrequire("GT34544AT7.authManager.getRoleByRoleCode");
    request.code = code;
    let res1 = func1.execute(request).res;
    roleInfo = res1;
    roleId = roleInfo.roleId;
    let func4 = extrequire("GT34544AT7.authManager.getRoleByRoleCode");
    request.code = code1;
    let res4 = func4.execute(request).res;
    roleInfo1 = res4;
    roleId1 = roleInfo1.roleId;
    let func2 = extrequire("GT34544AT7.authManager.unbindUserAndRole");
    request.userId = userId;
    request.roleId = roleId;
    let res2 = func2.execute(request).res;
    let func3 = extrequire("GT34544AT7.authManager.unbindUserAndRole");
    request.userId = userId;
    request.roleId = roleId1;
    let res3 = func3.execute(request).res;
    let res = [];
    res.push(res2);
    res.push(res3);
    res.push(res4);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });