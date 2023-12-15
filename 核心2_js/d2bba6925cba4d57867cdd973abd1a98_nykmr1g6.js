let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    let currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let sysId = "yourIdHere";
    let tenantId = currentUser.tenantId;
    let userids = [currentUser.id];
    let result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    let resultJSON = JSON.parse(result);
    let staffOfCurrentUser;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      let userData = resultJSON.data;
      //业务系统员工
      staffOfCurrentUser = userData[currentUser.id];
    }
    return { staffOfCurrentUser };
  }
}
exports({ entryPoint: MyAPIHandler });