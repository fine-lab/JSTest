let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var DOMAIN = "https://www.example.com/"; //https://c2.yonyoucloud.com/iuap-api-gateway
    let staffUrl = DOMAIN + "/yonbip/hrcloud/HRCloud/getStaffDetail";
    let userID = request.userId;
    let body = { id: userID };
    let apiRes = openLinker("POST", staffUrl, "HRED", JSON.stringify(body));
    return JSON.parse(apiRes);
  }
}
exports({ entryPoint: MyAPIHandler });