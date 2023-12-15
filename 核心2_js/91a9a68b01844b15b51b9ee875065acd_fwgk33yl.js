let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    try {
      var strResponse = postman("get", "https://www.example.com/" + "fwgk33yl", null, null);
      var resp = JSON.parse(strResponse);
      return resp.data;
    } catch (e) {
      return { e };
    }
  }
}
exports({ entryPoint: MyAPIHandler });