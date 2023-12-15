let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var url = "https://www.example.com/" + request.access_token;
    var strResponse = postman("post", url, null, JSON.stringify(request.params));
    var responseObj = JSON.parse(strResponse);
    return { rst: responseObj, request: request };
  }
}
exports({ entryPoint: MyAPIHandler });