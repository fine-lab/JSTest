let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获得参数id
    var { id } = request;
    //根据id查询数据库
    var querySql = "select * from GT20314AT119.GT20314AT119.PrsNamePsn where PrsNamePsnFk = '" + id + "'"; //
    var res;
    try {
      res = ObjectStore.queryByYonQL(querySql);
    } catch (e) {
      throw new Error("查询数据失败" + e);
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });