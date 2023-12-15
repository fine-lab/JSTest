let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //执行sql
    let res = ObjectStore.queryByYonQL("select * from GT54365AT15.GT54365AT15.iorg", "developplatform");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });