let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    var resultJSON = JSON.parse(result);
    var userid;
    var username;
    var OrgId;
    var DeptId;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id; //员工id
      //业务系统员工name
      username = userData[currentUser.id].name; //员工name
      //业务系统员工组织id
      OrgId = userData[currentUser.id].orgId; //员工所属组织id
      //业务系统员工部门id
      DeptId = userData[currentUser.id].deptId; //员工所属部门id
    } else {
      throw new Error("获取员工信息异常");
    }
    //获取员工所在部门的上一级
    var sql = "select id,code,name,parentid,b.id,b.code,b.name from bd.adminOrg.AdminOrgVO left join bd.adminOrg.AdminOrgVO b on parentid = b.id where id='" + DeptId + "'";
    var res_dept = ObjectStore.queryByYonQL(sql, "ucf-org-center");
    return { userid: userid, username: username, dept: res_dept };
  }
}
exports({ entryPoint: MyAPIHandler });