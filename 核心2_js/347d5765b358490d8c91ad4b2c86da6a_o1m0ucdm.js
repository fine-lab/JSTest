let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var sql = "select * from GT879AT352.GT879AT352.fksq where id ='" + request.id + "'";
    //实体查询
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });