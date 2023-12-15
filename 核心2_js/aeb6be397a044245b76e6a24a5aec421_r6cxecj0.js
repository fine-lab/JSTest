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
    var orgId;
    var orgName;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id; //员工id
      username = userData[currentUser.id].name;
      orgId = userData[currentUser.id].orgId;
      orgName = userData[currentUser.id].orgName;
    } else {
      throw new Error("获取员工信息异常");
    }
    return { res: userid, username, orgId, orgName };
  }
}
exports({ entryPoint: MyAPIHandler });