let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 配置apidi地址
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    // 获取到的参数
    var query = request.query;
    let func1 = extrequire("GT19153AT99.openapi.getAccessToken");
    let res = func1.execute(request);
    var token = res.access_token;
    //请求数据
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(query));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });