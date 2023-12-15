let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //使用公共函数--------------begin
    let func1 = extrequire("GT12951AT32.config.getApiAccessToken");
    let res = func1.execute(request);
    let configfun = extrequire("GT12951AT32.config.baseConfig");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var token = res.access_token;
    var id = request;
    var requrl = config.config.baseUrl + "/yonbip/fi/oap/detail?access_token=" + token + "&id=" + id;
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var strResponse = postman("GET", requrl, JSON.stringify(header));
    var responseObj = JSON.parse(strResponse);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });