let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 更新条件
    let sql = "select * from aa.store.Store ";
    var res = ObjectStore.queryByYonQL(sql, "pricecenter");
    return {
      res
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});