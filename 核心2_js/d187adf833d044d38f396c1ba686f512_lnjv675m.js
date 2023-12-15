let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var token = request.token;
    var url = "https://www.example.com/";
    function getdata(token, url) {
      const header = {
        "Content-Type": "application/json"
      };
      var list_body_strResponse = postman("get", url + "?access_token=" + token, null, null);
      var Response = JSON.parse(list_body_strResponse);
      return Response;
    }
    var accept = getdata(token, url);
    return { accept: accept };
  }
}
exports({ entryPoint: MyAPIHandler });