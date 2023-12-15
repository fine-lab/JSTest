let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = currentUser.id;
    var sql = "select caigouceshi123_id id from GT62830AT6.GT62830AT6.caigoubaojia123 where new17 = '" + userids + "'";
    var res = ObjectStore.queryByYonQL(sql);
    var ids = [];
    for (var prop in res) {
      ids.push(res[prop].id);
    }
    var object = { ids: ids };
    var result = ObjectStore.selectBatchIds("GT62830AT6.GT62830AT6.caigouceshi123", object);
    return { userids: userids, res: result };
  }
}
exports({ entryPoint: MyAPIHandler });