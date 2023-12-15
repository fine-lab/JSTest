let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code;
    var header = {
      "Content-Type": "application/json;charset=utf-8"
    };
    var url = "https://www.example.com/";
    var resp = postman("GET", url, null, null);
    if (resp) {
      var obj = JSON.parse(resp);
      var body = { code: code };
      var access_token = obj.access_token;
      //获取微信手机号
      var url = "https://www.example.com/" + access_token;
      var resp = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
      if (resp) {
        var obj = JSON.parse(resp);
        return { result: obj };
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });