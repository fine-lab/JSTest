let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = JSON.parse(AppContext());
    var tid = data.currentUser.tenantId;
    var staffId = data.currentUser.staffId;
    var userId = data.currentUser.id;
    let deptId = data.currentUser.deptId;
    let paramStaffId = request.paramStaffId;
    if (paramStaffId == undefined || paramStaffId == null || paramStaffId == "") {
      paramStaffId = data.currentUser.staffId;
    }
    if ("1702818597295882243" == deptId || "1702819112702443525" == deptId) {
      paramStaffId = "yourIdHere"; //来亚南--竞价部 1702831920299114505
    }
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let staffUrl = DOMAIN + "/yonbip/digitalModel/staffQry/currentStaffSubStaffDTO";
    let body = { staffId: paramStaffId, isInCludeLeaveStaff: true };
    let apiRes = openLinker("POST", staffUrl, "GT3734AT5", JSON.stringify(body));
    return { rstData: JSON.parse(apiRes), staffId: staffId, usr: data.currentUser };
  }
}
exports({ entryPoint: MyAPIHandler });