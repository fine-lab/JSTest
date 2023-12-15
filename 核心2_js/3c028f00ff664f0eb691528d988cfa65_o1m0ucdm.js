let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var sql = "select * from GT879AT352.GT879AT352.htxqc limit 0,10";
    //实体查询
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });