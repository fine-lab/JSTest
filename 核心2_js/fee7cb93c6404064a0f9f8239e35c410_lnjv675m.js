let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取自建表所需数据
    let sql = "select id,parent,sys_orgId,sys_parent from GT34544AT7.GT34544AT7.IndustryOwnOrg where dr = 0";
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });