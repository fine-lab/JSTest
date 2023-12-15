let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let codesInSqlCond = "('" + request.cods.join("','") + "')";
    //根据sn 获取数据库中是否有相同数据
    var yonsql = "select * from fa.fixedasset.FixedAssetsInfo where code in " + codesInSqlCond;
    var res = ObjectStore.queryByYonQL(yonsql, "yonyoufi");
    return { data: res };
  }
}
exports({ entryPoint: MyAPIHandler });