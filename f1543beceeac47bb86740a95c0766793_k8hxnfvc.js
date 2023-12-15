let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询条件
    var sql = "select * from AT1764FBE617500005.AT1764FBE617500005.pur_type_rule where enable='1'";
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });