let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var access_token = request.access_token;
    var org = request.org;
    let suffix = "?" + "access_token=" + access_token;
    let queryCurrentStockUrl = "https://www.example.com/" + suffix;
    //请求头
    var header = { "Content-Type": "application/json" };
    var body = {
      iUsed: "enable",
      org: [org]
    };
    let mode = "post";
    var strResponse = postman(mode, queryCurrentStockUrl, JSON.stringify(header), JSON.stringify(body));
    //返回数据
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });