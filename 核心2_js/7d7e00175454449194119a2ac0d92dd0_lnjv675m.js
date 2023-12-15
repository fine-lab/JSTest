let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = "gxs_org_admin";
    let userId = request.userId;
    let tenantId = null;
    let context = null;
    let roleInfo = null;
    let roleId = null;
    let roleCode = null;
    // 获取当前角色用户信息
    let func1 = extrequire("GT34544AT7.authManager.getRoleByRoleCode");
    request.code = code;
    let res1 = func1.execute(request).res;
    roleInfo = res1;
    roleId = roleInfo.roleId;
    tenantId = res1.tenantId;
    roleCode = res1.roleCode;
    // 绑定当前角色
    let func2 = extrequire("GT34544AT7.authManager.bindUserAndRole");
    request.userId = userId;
    request.roleId = roleId;
    request.roleCode = roleCode;
    request.tenantId = tenantId;
    let res = func2.execute(request).res;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });