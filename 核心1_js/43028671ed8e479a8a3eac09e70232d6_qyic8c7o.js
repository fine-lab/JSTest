let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT65927AT11.backDefaultGroup.getTokenNew");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    var api_url = resToken.api_url;
    var res = AppContext();
    var userdate = JSON.parse(res);
    let body = { userId: [userdate.currentUser.id] }; //13877c8f2575478eb1ad79f59c6b4941
    let url = api_url + "/yonbip/crm/clue/getbyid?access_token=" + token + "&id=" + request.id;
    let apiResponse = null;
    try {
      apiResponse = postman("GET", url, null, null);
    } catch (e) {
      return { e };
    }
    return { apiResponse: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });