let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sql = request.sql;
    let domainKey = request.domainKey;
    var res = ObjectStore.queryByYonQL(sql, domainKey);
    // 更新条件
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });