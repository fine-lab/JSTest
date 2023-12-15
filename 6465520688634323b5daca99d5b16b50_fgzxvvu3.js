let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let staffOfCurrentUser;
    let mainOrgId = request.mainOrgId;
    //获取当前用户的身份信息-----------
    let currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    //查询员工基本信息
    let sql = "select id,code,name, deptId, deptId.code deptCode, deptId.name deptName from hred.staff.Staff where userId = '" + currentUser.id + "'";
    let staffInfo = ObjectStore.queryByYonQL(sql, "hrcloud-staff-mgr");
    //查询员工组织信息
    if (staffInfo.length > 0) {
      let orgSql = "select orgId,orgId.code orgCode, orgId.name orgName from hred.staff.StaffOrgRel where staffId = '" + staffInfo[0].id + "' and endFlag = '0' ";
      let staffOrgInfo = ObjectStore.queryByYonQL(orgSql, "hrcloud-staff-mgr");
      if (staffOrgInfo.length > 0 && staffOrgInfo[0].orgId == mainOrgId) {
        staffInfo[0].orgId = staffOrgInfo[0].orgId;
        staffInfo[0].orgCode = staffOrgInfo[0].orgCode;
        staffInfo[0].orgName = staffOrgInfo[0].orgName;
      } else {
        return {};
      }
      staffOfCurrentUser = staffInfo[0];
    }
    return { staffOfCurrentUser };
  }
}
exports({ entryPoint: MyAPIHandler });