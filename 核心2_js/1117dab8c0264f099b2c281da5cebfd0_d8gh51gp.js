let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userId = currentUser.id;
    var userids = [userId];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    var resultJSON = JSON.parse(result);
    var userData = resultJSON.data;
    var returnData = {};
    let sql = "select *,role.* from sys.auth.UserRole  where tenant='" + tenantId + "' and yhtUser='" + userId + "'";
    var res = ObjectStore.queryByYonQL(sql, "u8c-auth");
    var roleCode = "";
    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        roleCode = roleCode + res[i].role_code;
        if (i != res.length - 1) {
          roleCode = roleCode + ",";
        }
      }
    }
    if ("1" == resultJSON.status && JSON.stringify(userData) != "{}") {
      //根据当前用户信息去查询员工表
      //业务系统员工id
      returnData = userData[userId]; //员工信息
      returnData.roleCode = roleCode;
    } else {
      returnData.orgId = null;
      returnData.orgName = null;
      returnData.roleCode = roleCode;
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });