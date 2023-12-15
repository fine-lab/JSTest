let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    let id = res.currentUser.id;
    let name = res.currentUser.name;
    // 租户id
    let tenant = res.currentUser.tenantId;
    var sysId = "yourIdHere";
    var tenantId = tenant;
    var userids = [id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    return { resu, res };
  }
}
exports({ entryPoint: MyAPIHandler });