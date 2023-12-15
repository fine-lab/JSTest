let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var requestUrl = "https://www.example.com/";
    var access_token = request.token;
    var parentorgid = request.parentorgid;
    var enable = [1];
    var requestBody = {
      externalData: {
        parentorgid: parentorgid,
        enable: enable
      }
    };
    var requestHeader = { "Content-Type": "application/json" };
    var strResponse = postman("post", requestUrl + "?access_token=" + access_token, JSON.stringify(requestHeader), JSON.stringify(requestBody));
    var data = JSON.parse(strResponse);
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });