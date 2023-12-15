let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var sql = "select * from AT1716B0DE09100008.AT1716B0DE09100008.orderFusing where id = 1663731706256424960";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });