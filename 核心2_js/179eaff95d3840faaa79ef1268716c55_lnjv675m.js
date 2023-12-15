let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let res = {};
    let sql = "select * from GT54365AT15.GT54365AT15.iorg where sys_orgId = " + id + " and dr = 0";
    //执行sql
    let sss = ObjectStore.queryByYonQL(sql, "developplatform");
    if (sss === null || sss === undefined || sss.length === 0) {
      res = 1;
    } else {
      res = 0;
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });