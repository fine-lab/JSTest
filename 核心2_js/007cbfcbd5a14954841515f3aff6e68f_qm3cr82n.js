let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      pageIndex: "1",
      pageSize: "10"
    };
    let func1 = extrequire("GT19147AT97.openapi.getOpenApiToken1");
    let res = func1.execute(request);
    var token = res.access_token;
    //请求数据
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });