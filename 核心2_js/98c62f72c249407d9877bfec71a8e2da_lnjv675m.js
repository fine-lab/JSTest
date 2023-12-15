let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取当前用户的用户信息
    let res1 = JSON.parse(AppContext());
    //值是一个currentUser对象
    // 获取当前用户的员工id
    let staffId = res1.currentUser.staffId;
    let sql1 = "select id from GT34544AT7.GT34544AT7.IndustryUsers	where staff_id = " + staffId;
    //值是一个数组对象
    //执行sql，获取当前用户在--行业用户表--的userId
    let res2 = ObjectStore.queryByYonQL(sql1, "developplatform");
    let id = res2[0].id;
    // 设置要查询的目标表----->兼职信息
    let table = "GT34544AT7.GT34544AT7.org_join";
    // 设置查询条件
    let conditions = " is_enable = 1 and IndustryUsers_id = " + id;
    //拼接sql
    let sql = "select sys_org_join_id,sys_dept_join_id from " + table + " where " + conditions;
    //执行sql
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });