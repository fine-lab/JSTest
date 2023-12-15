let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let parentId = request.id;
    //执行sql
    let res = ObjectStore.queryByYonQL("select id from GT54365AT15.GT54365AT15.iorg where sys_orgId = " + parentId, "developplatform");
    res = res[0].id;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });