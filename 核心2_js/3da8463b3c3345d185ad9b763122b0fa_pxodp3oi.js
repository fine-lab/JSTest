let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let staffUrl = DOMAIN + "/yonbip/hrcloud/staff/listmdd";
    let userName = request.userName;
    let body = { name: userName };
    let apiRes = openLinker("POST", staffUrl, "GT3734AT5", JSON.stringify(body)); //HRED
    return JSON.parse(apiRes);
  }
}
exports({ entryPoint: MyAPIHandler });