let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/" + "access_token=" + request.access_token + "&id=" + request.id + "&productApplyRangeId=1927547564660224";
    let strResponse = postman("get", url, null, null);
    let responseObj = JSON.parse(strResponse);
    return { rst: responseObj, request: request };
  }
}
exports({ entryPoint: MyAPIHandler });