let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var staffId = request.staffId;
    var token = request.token;
    if (!token) {
      let getAccessToken = extrequire("GT32996AT2.OpenAPI.getAccessToken");
      var paramToken = {};
      resToken = getAccessToken.execute(paramToken);
      token = resToken.access_token;
    }
    var strResponse = postman("get", "https://www.example.com/" + token + "&id=" + staffId, null, null);
    var resp = JSON.parse(strResponse);
    return resp.data;
  }
}
exports({ entryPoint: MyAPIHandler });