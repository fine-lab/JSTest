let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var sql = "select * from AT168255FC17080007.AT168255FC17080007.orderFusing where id = 1624209133954138114";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });