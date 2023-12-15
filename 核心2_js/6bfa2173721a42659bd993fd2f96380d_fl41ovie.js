let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(request) {
    //获取用户信息
    var res = AppContext();
    var userInfo = JSON.parse(res);
    var params = Object.assign(userInfo, request.data[0]);
    var paramsJson = JSON.stringify(params);
    var strResponse = postman("post", "https://www.example.com/", JSON.stringify({}), JSON.stringify(params));
    //将数据保存到数据库
    var res = ObjectStore.insert("GT7483AT95.GT7483AT95.licenseyw", params, "f5dd21ad");
    return {};
  }
}
exports({ entryPoint: MyTrigger });