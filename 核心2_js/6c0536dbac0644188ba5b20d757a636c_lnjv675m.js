let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = "coop_org_admin";
    let userId = request.userId;
    let roleInfo = null;
    let roleId = null;
    // 获取当前角色用户信息
    let func1 = extrequire("GT34544AT7.authManager.getRoleByRoleCode");
    request.code = code;
    let res1 = func1.execute(request).res;
    roleInfo = res1;
    roleId = roleInfo.roleId;
    let func2 = extrequire("GT34544AT7.authManager.unbindUserAndRole");
    request.userId = userId;
    request.roleId = roleId;
    let res = func2.execute(request).res;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });