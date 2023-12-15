let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let staffUrl = DOMAIN + "/yonbip/hrcloud/HRCloud/getStaffDetail";
    let userID = request.userId;
    let body = { id: userID };
    let apiRes = openLinker("POST", staffUrl, "GT3734AT5", JSON.stringify(body)); //HRED
    return JSON.parse(apiRes);
  }
}
exports({ entryPoint: MyAPIHandler });