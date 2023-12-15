let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code;
    var header = {
      "Content-Type": "application/json;charset=utf-8"
    };
    var appid = request.appid;
    var secret = request.secret;
    var url = "https://www.example.com/" + appid + "&secret=" + secret;
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
        var phoneInfo = obj.phone_info;
        if (phoneInfo) {
          var phoneNumber = phoneInfo.phoneNumber;
          //查询手机号是否已注册过
          var registerInfo = ObjectStore.queryByYonQL("select * from GT37846AT3.GT37846AT3.RZH_901 where DengLuMing='" + phoneNumber + "'");
          if (registerInfo) {
            //已注册
            //未注册
            return {
              result: obj,
              isRegister: 1 //已注册
            };
          }
          //未注册
          return {
            result: obj,
            isRegister: 0 //未注册
          };
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });