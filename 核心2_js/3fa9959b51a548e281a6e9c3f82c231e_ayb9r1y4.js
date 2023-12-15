let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //通过上下文获取员工友互通id
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result1 = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var ss = JSON.parse(result1);
    return { currentUser };
  }
}
exports({ entryPoint: MyAPIHandler });