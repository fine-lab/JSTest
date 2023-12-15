let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let roleCode = request.roleCode;
    let userId = request.userId;
    let roleId = request.roleId;
    // 获取当前角色用户信息
    let ss = JSON.parse(AppContext());
    let context = ss.currentUser;
    let tenantId = context.tenantId;
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