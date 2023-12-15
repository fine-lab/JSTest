let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(request) {
    //获取用户信息
    var res = AppContext();
    var userInfo = JSON.parse(res);
    var params = Object.assign(userInfo, request.data[0]);
    var paramsJson = JSON.stringify(params);
    var strResponse = postman("post", "https://www.example.com/", JSON.stringify({}), JSON.stringify(params));
    return {};
  }
}
exports({ entryPoint: MyTrigger });