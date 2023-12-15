let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var strResponse = postman("get", "https://www.example.com/" + currentUser.tenantId, null, null);
    var resp = JSON.parse(strResponse);
    return resp.data;
  }
}
exports({ entryPoint: MyAPIHandler });