let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var code = request.code;
    let getAccessToken = extrequire("GT30659AT3.backDefaultGroup.getAccessToken");
    var paramToken = {};
    let resToken = getAccessToken.execute(paramToken);
    var token = resToken.access_token;
    var strResponse = postman("get", "https://www.example.com/" + token + "&id=" + id + "&code=" + code, null, null);
    var resp = JSON.parse(strResponse);
    return resp;
  }
}
exports({ entryPoint: MyAPIHandler });