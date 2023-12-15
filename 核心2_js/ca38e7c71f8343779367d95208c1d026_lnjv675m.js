let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let userId = request.userId;
    let roleId = request.roleId;
    // 获取当前角色用户信息
    // 解绑当前角色
    let func2 = extrequire("GT34544AT7.authManager.unbindUserAndRole");
    request.userId = userId;
    request.roleId = roleId;
    let res = func2.execute(request).res;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });