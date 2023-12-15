let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rolecode = request.rolecode;
    let rolename = request.rolename;
    let contextObj = JSON.parse(AppContext());
    let userId = contextObj.currentUser.id;
    let tenantId = contextObj.currentUser.tenantId;
    let staffId = contextObj.currentUser.staffId;
    let deptId = contextObj.currentUser.deptId;
    var listOrgAndDept = listOrgAndDeptByUserIds("diwork", tenantId, [userId]);
    let sql = "select *，role.* from sys.auth.UserRole where tenant='" + tenantId + "' and yhtUser='" + userId + "'";
    var res = ObjectStore.queryByYonQL(sql, "u8c-auth");
    let chkrst = false;
    let adminRole = false;
    if (true) {
      for (var i in res) {
        let roleObj = res[i];
        if (roleObj.role_code == "htglgl" || roleObj.role_code == "HTGL" || roleObj.role_code == "00301" || "demogl" == roleObj.role_code) {
          // 管理员&审计00301
          adminRole = true;
          break;
        }
      }
    }
    if (rolecode) {
      for (var i in res) {
        let roleObj = res[i];
        if (roleObj.role_code == rolecode) {
          chkrst = true;
          break;
        }
      }
    }
    if (rolename) {
      for (var i in res) {
        let roleObj = res[i];
        if (roleObj.role_name == rolename) {
          chkrst = true;
          break;
        }
      }
    }
    return { rst: true, chkrst: chkrst, roles: res, admin: adminRole, staffId: staffId, contextObj: contextObj, listOrgAndDept: listOrgAndDept };
  }
}
exports({ entryPoint: MyAPIHandler });