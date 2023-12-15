let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var resJson = {};
    var yhtUserId = request.userId;
    let token_url = "https://www.example.com/" + yhtUserId;
    resJson.token_url = token_url;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let tokenResponse = postman("get", token_url, null, null);
    resJson.tokenResponse = tokenResponse;
    return resJson;
  }
}
exports({ entryPoint: MyAPIHandler });