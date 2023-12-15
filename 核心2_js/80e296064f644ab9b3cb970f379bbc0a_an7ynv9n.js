let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT80750AT4.backDefaultGroup.getToKen");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    var data = request.data;
    var Body = { data: data };
    var strResponse = postman("POST", "https://www.example.com/" + token, null, JSON.stringify(Body));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });