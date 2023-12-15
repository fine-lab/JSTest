let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取GC用户
    let table = "GT1559AT25.GT1559AT25.AgentUser";
    let billno = "893bc133";
    let func1 = extrequire("GT1559AT25.staff.AGStaffToAGUser");
    // 获取转换后的GCUser信息
    let GCUser = func1.execute(request).res;
    // 搜索是否存在
    let basesearchUser = {
      SysStaffNew: GCUser.SysStaffNew
    };
    let searchUsers = ObjectStore.selectByMap(table, basesearchUser);
    let res = {};
    if (searchUsers.length > 0) {
      let searchUser = searchUsers[0];
      GCUser["id"] = searchUser.id;
      res = ObjectStore.updateById(table, GCUser, billno);
    } else {
      res = ObjectStore.insert(table, GCUser, billno);
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });