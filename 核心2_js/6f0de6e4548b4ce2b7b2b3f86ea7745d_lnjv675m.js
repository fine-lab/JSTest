let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取关系表所需数据
    let sql = "select * from GT34544AT7.GT34544AT7.MyOrg where dr = 0";
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });