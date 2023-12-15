let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT65292AT10.backDefaultGroup.getToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    let url = "https://www.example.com/" + token + "&id=" + request.CustomerId;
    let apiResponse = null;
    try {
      apiResponse = postman("get", url, null, null);
    } catch (e) {
      return { e };
    }
    return { apiResponse: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });