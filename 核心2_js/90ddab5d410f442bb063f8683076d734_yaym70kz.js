let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    var userid;
    var allData;
    var deptid;
    var deptCode;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id;
      deptid = userData[currentUser.id].deptId;
      deptCode = userData[currentUser.id].deptCode;
    } else {
      throw new Error("获取员工信息异常");
    }
    return { deptid: deptid, userData: userData[currentUser.id] };
  }
}
exports({ entryPoint: MyAPIHandler });