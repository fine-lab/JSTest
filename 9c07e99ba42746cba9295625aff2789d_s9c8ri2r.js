let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //员工id和编码
    var id = request.id;
    //获取token
    let getAccessToken = extrequire("GT3407AT1.test.getAccessToken");
    var paramToken = {};
    let resToken = getAccessToken.execute(paramToken);
    var token = resToken.access_token;
    //调用API接口查询
    var strResponse = postman("get", "https://www.example.com/" + token + "&id=" + id, null, null);
    var resp = JSON.parse(strResponse);
    return resp;
  }
}
exports({ entryPoint: MyAPIHandler });