let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var name = currentUser.name;
    var tenantId = currentUser.tenantId;
    var userId = currentUser.id;
    if (name != null) {
      var sql = "select * from yhtTenantBase.user.User where yhtUserId = '" + userId + "' and yhtTenantId = '" + tenantId + "'";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      if (res.length == 0) {
        throw new Error("获取当前登陆者信息失败；");
      }
      var date = {
        name: name,
        id: res[0].id
      };
      return { date };
    } else {
      throw new Error("获取当前登陆者信息失败；");
    }
  }
}
exports({ entryPoint: MyAPIHandler });