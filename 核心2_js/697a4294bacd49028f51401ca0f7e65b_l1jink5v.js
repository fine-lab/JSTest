let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var url = "https://www.example.com/" + request.access_token + "&id=" + request.deptid;
    var strResponse = postman("get", url, null, null);
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      return { data: responseObj.data };
    }
    return { data: strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });