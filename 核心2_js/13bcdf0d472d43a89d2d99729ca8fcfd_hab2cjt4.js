let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var requestUrl = "https://www.example.com/";
    var access_token = request.token;
    var code = request.code;
    var object = {
      data: {
        code: [code]
      }
    };
    var header = {
      "Content-Type": "application/json"
    };
    var strResponse = postman("post", requestUrl + "?access_token=" + access_token, JSON.stringify(header), JSON.stringify(object));
    var data = JSON.parse(strResponse);
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });