let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT65292AT10.backDefaultGroup.getToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    var res = AppContext();
    var userdate = JSON.parse(res);
    let url = "https://www.example.com/" + token + "&id=" + request.id;
    let apiResponse = null;
    try {
      apiResponse = postman("GET", url, null);
    } catch (e) {
      return { e };
    }
    return { apiResponse: JSON.parse(apiResponse), token: token };
  }
}
exports({ entryPoint: MyAPIHandler });