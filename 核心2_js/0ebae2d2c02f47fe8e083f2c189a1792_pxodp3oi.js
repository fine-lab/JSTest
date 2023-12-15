let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let ifUrl = DOMAIN + "/yonbip/digitalModel/admindept/detail";
    let orgID = request.orgId;
    let body = { id: orgID };
    let apiRes = openLinker("GET", ifUrl + "?id=" + orgID, "GT3734AT5", JSON.stringify(body)); //GZTBDM
    return JSON.parse(apiRes);
  }
}
exports({ entryPoint: MyAPIHandler });