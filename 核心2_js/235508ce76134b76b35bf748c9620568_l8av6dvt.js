let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var code = request.code;
    let getAccessToken = extrequire("GT55244AT1.backDefaultGroup.getAccessToken");
    var paramToken = {};
    let resToken = getAccessToken.execute(paramToken);
    var token = resToken.access_token;
    var strResponse = postman("get", "https://www.example.com/" + token + "&id=" + id + "&merchantApplyRangeId=0", null, null);
    var resp = JSON.parse(strResponse);
    return resp;
  }
}
exports({ entryPoint: MyAPIHandler });