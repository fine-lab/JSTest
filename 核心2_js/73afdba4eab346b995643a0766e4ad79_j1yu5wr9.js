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
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      // 组装入参的json对象（不要传string）
      var org_id = userData[currentUser.id].orgId;
      var json = {
        orgId: userData[currentUser.id].orgId, // 组织id
        orgName: userData[currentUser.id].orgName,
        orgCode: userData[currentUser.id].orgCode
      };
      return {
        json: json,
        currentUser: currentUser,
        userData: userData
      };
    } else {
      throw new Error("获取用户信息异常");
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});