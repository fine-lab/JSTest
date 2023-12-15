let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    var userid;
    var username;
    var deptCode;
    var orgCode;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id;
      username = userData[currentUser.id].name;
      deptCode = userData[currentUser.id].deptCode;
      orgCode = userData[currentUser.id].orgCode;
    } else {
      throw new Error("获取员工信息异常");
    }
    return { userid: userid, username: username };
  }
}
exports({ entryPoint: MyAPIHandler });