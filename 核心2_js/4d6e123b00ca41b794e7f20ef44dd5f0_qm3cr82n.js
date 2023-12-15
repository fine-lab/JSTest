let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获得参数id
    var { id } = request;
    //根据id查询数据库 from 工序名称的url
    var querySql = "select * from GT40095AT224.GT40095AT224.ProductName where PrsPlanNEO_id = '" + id + "'"; //
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