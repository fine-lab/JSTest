let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT6948AT29.common.getOpenApiToken");
    let resFun1 = func1.execute(request);
    let configfun = extrequire("GT6948AT29.common.baseConfig");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var token = resFun1.access_token;
    var requrl = config.config.baseApiUrl + request.uri + "?access_token=" + token;
    if (request.parm !== undefined) {
      requrl += "&" + request.parm;
    }
    const header = {
      "Content-Type": "application/json"
    };
    var res1 = postman("post", requrl, JSON.stringify(header), JSON.stringify(request.body));
    var res = JSON.parse(res1);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });