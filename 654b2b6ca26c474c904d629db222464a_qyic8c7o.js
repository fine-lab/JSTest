let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT65292AT10.backDefaultGroup.getToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    return { token };
    var api_url = "https://www.example.com/";
    var res = AppContext();
    var userdate = JSON.parse(res);
    let body = { userId: [userdate.currentUser.id] }; //13877c8f2575478eb1ad79f59c6b4941
    let url = api_url + "/yonbip/digitalModel/staffQry/getStaff?access_token=" + token;
    let apiResponse = null;
    try {
      apiResponse = postman("POST", url, null, JSON.stringify(body));
    } catch (e) {
      return { e };
    }
    return { apiResponse: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });