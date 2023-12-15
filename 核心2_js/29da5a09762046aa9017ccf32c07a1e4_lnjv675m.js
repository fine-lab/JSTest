let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取当前用户的用户信息
    let res1 = JSON.parse(AppContext());
    //值是一个currentUser对象
    // 获取当前用户的员工id
    let uuid = res1.currentUser.id;
    // 设置要查询的目标表----->管理组织信息
    let table = "GT34544AT7.GT34544AT7.gxsOrgAdmin";
    // 设置查询条件
    let conditions = " isEnable = '1' and StaffNewSysyhtUserId = '" + uuid + "'";
    //拼接sql
    let sql = "select * from " + table + " where " + conditions;
    //执行sql
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    let arr = [];
    for (let j = 0; j < res.length; j++) {
      arr.push(res[j].sysManagerOrg);
    }
    return { arr: arr };
  }
}
exports({ entryPoint: MyAPIHandler });