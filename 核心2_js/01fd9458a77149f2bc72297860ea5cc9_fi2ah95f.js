let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var requestUrl = "https://www.example.com/";
    var access_token = request.token;
    var id = request.id;
    var strResponse = postman("get", requestUrl + "?access_token=" + access_token + "&id=" + id, null, null);
    var data = JSON.parse(strResponse);
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });