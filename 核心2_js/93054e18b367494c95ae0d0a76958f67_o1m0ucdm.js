let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var sql = "select * from AXT000132.AXT000132.purchaseRequest limit 0,10";
    //实体查询
    var res = ObjectStore.queryByYonQL(sql, "yonbip-cpu-sourcing");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });