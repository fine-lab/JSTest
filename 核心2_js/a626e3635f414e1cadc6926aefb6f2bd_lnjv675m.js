let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //拼接sql
    let sql = "select sys_orgId,id from GT34544AT7.GT34544AT7.IndustryOwnOrg";
    //执行sql
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    //拼接sql
    let sql1 = "select id,sysPrent from GT34544AT7.GT34544AT7.MyOrg";
    //执行sql
    let res1 = ObjectStore.queryByYonQL(sql1, "developplatform");
    for (let i = 0; i < res.length; i++) {
      for (let j = 0; j < res1.length; j++) {
        if (res[i].sys_orgId === res1[j].sysPrent) {
          var object = { id: res1[j].id, guanlianguanxi: res[i].id };
          var res3 = ObjectStore.updateById("GT34544AT7.GT34544AT7.MyOrg", object, "9bb73d4c");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });