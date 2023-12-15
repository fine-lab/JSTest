let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function CallAPI(mode, url, param) {
      //请求头
      var header = { "Content-Type": "application/json" };
      var strResponse = postman(mode, url, JSON.stringify(header), JSON.stringify(param));
      //返回数据
      return JSON.parse(strResponse);
    }
    let func1 = extrequire("ST.zcKucun.getToken");
    let res = func1.execute();
    let access_token = res.access_token;
    let suffix = "?access_token=" + access_token;
    let url = "https://www.example.com/" + suffix;
    let ps = { code_array: request.code_array };
    let result = CallAPI("POST", url, ps);
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });