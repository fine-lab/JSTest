let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT19774AT432.api.getToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var requestUrl = "https://www.example.com/" + token;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      renyuanbianma: request.shoujihao
    };
    //请求数据
    let apiResponse = postman("post", requestUrl, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });