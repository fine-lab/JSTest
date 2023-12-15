let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var requestUrl = "https://www.example.com/";
    var access_token = request.token;
    var requestBody = { access_token: access_token };
    var requestHeader = { "Content-Type": "application/json" };
    var strResponse = postman("post", requestUrl + "?access_token=" + access_token, JSON.stringify(requestHeader), JSON.stringify(requestBody));
    var data = JSON.parse(strResponse);
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });