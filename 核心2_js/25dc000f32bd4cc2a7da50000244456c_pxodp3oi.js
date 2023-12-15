let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var data = JSON.parse(res);
    var tid = data.currentUser.tenantId;
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let staffUrl = DOMAIN + "/yonbip/hrcloud/HRCloud/getStaffDetail";
    let staffId = data.currentUser.staffId;
    if (request.staffId) {
      staffId = request.staffId;
    }
    let body = { id: staffId };
    let apiRes = openLinker("POST", staffUrl, "GT3734AT5", JSON.stringify(body)); //HRED
    return { data, staffDetail: JSON.parse(apiRes) };
  }
}
exports({ entryPoint: MyAPIHandler });