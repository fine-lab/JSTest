let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户信息
    let userId = JSON.parse(AppContext()).currentUser.id;
    //使用YonSQL查询原厂单据信息
    let yonql =
      "select code,name,mainJobList.org_id.name as orgName,mainJobList.org_id as orgId, " +
      " mainJobList.dept_id.name as deptName,mainJobList.dept_id as deptId " +
      " from bd.staff.StaffNew where user_id = '" +
      userId +
      "'";
    let result = ObjectStore.queryByYonQL(yonql, "ucf-staff-center");
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });