let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    // 前端函数调用后端函数，前端函数传入的参数是放在 request 中
    var body = {
      data: request.body
    };
    let func1 = extrequire("GT18216AT3.backDefaultGroup.getOpenApiToken");
    // 获取 token
    let res = func1.execute(request);
    var token = res.access_token;
    // 请求数据
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
    return { res: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });