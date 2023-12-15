let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT65292AT10.backDefaultGroup.getTokenNew");
    let paramToken = {};
    let resToken = func1.execute(paramToken);
    let token = resToken.access_token;
    let api_url = resToken.api_url;
    let res = AppContext();
    let userdate = JSON.parse(res);
    let body = {
      userId: [request.user_id ? request.user_id : userdate.currentUser.id]
    }; //13877c8f2575478eb1ad79f59c6b4941
    let url = api_url + "/yonbip/digitalModel/staffQry/getStaff?access_token=" + token;
    let apiResponse = null;
    try {
      apiResponse = postman("POST", url, null, JSON.stringify(body));
    } catch (e) {
      return {
        e
      };
    }
    return {
      apiResponse: apiResponse,
      version: "20220614",
      api_url: api_url
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});