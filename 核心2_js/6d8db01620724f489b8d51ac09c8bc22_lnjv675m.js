let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取自建表所需数据
    let sql = "select * from GT34544AT7.GT34544AT7.IndustryOwnOrg where dr = 0";
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });