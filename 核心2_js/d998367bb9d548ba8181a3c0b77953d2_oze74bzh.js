let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT32323AT47.common.getOpenApiToken");
    let resFun1 = func1.execute(request);
    let configfun = extrequire("GT32323AT47.common.baseConfig");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var token = resFun1.access_token;
    var requrl = config.config.baseApiUrl + request.uri + "?access_token=" + token;
    const header = {
      "Content-Type": "application/json"
    };
    var res = postman("post", requrl, JSON.stringify(header), JSON.stringify(request.body));
    var res = JSON.parse(res);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });