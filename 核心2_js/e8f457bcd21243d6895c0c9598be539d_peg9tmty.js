let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取id
    var id = request.id;
    //获取字段名
    var field = request.field;
    //获取表名
    var entity = request.entity;
    var clientCodeSql = "select * from " + entity + " where " + field + " = '" + id + "'";
    var subDate = ObjectStore.queryByYonQL(clientCodeSql);
    return { subDate };
  }
}
exports({ entryPoint: MyAPIHandler });