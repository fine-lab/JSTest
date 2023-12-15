let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询数据库数据
    var querysql = "select a.* from GT71376AT32.GT71376AT32.hqs_properties a limit 1";
    //返回第一条数据
    var result = ObjectStore.queryByYonQL(querysql)[0];
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });