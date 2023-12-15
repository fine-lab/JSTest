let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT65292AT10.backDefaultGroup.getTokenNew");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    var api_url = resToken.api_url;
    var res = AppContext();
    var userdate = JSON.parse(res);
    let url = api_url + "/yonbip/digitalModel/role/getTenantRoles?access_token=" + token;
    let body = { systemCode: "diwork", tenantId: "yourIdHere" }; //13877c8f2575478eb1ad79f59c6b4941
    let apiResponse = null;
    try {
      apiResponse = postman("POST", url, null, JSON.stringify(body));
    } catch (e) {
      return { e };
    }
    return { apiResponse: JSON.parse(apiResponse), token: token };
  }
}
exports({ entryPoint: MyAPIHandler });