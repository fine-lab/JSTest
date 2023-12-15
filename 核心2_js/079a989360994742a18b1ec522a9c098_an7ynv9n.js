let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT80750AT4.backDefaultGroup.getToKen");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    var id = request.bipjiaoyileixing;
    var strResponse = postman("post", "https://www.example.com/" + token + "&id=" + id, null, null);
    return { strResponse: strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });