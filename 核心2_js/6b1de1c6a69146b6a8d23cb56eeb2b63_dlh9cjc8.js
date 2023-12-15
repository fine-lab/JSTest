let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var yhtUserId = request.userId;
    let token_url = "https://www.example.com/" + yhtUserId;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let tokenResponse = postman("get", token_url, null, null);
    return JSON.parse(tokenResponse);
  }
}
exports({ entryPoint: MyAPIHandler });