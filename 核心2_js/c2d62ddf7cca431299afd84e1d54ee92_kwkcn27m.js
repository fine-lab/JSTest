let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let userId = request.userId;
    // 在用户群里面查找用户
    let is_user_in = (users) => {
      let user_in = false;
      for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user.yhtUserId === userId) {
          user_in = true;
          break;
        }
      }
      return user_in;
    };
    // 获取当前租户的所有角色的id集合
    let allroles = [];
    let func2 = extrequire("GT53685AT3.role.getTenantRoles");
    let res2 = func2.execute(request).res;
    // 获取角色集合roleInfos
    let roleInfos = res2.data;
    for (let i in roleInfos) {
      let roleInfo = roleInfos[i];
      allroles.push(roleInfo);
    }
    // 用户的角色
    let roles = [];
    for (let i in allroles) {
      let role = allroles[i];
      // 获取角色下的所有用户
      let func1 = extrequire("GT53685AT3.role.getRoleUsers");
      request.roleId = role.roleId;
      let res1 = func1.execute(request).res;
      throw new Error("res1 = " + res1);
      let is_in = is_user_in(res1);
      if (is_in) {
        roles.push(role);
      }
    }
    let res = roles;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });