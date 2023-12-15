let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT30667AT8.common.getOpenApiToken");
    let resFun1 = func1.execute(request);
    let configfun = extrequire("GT30667AT8.common.baseconfig");
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
    var res = postman("post", requrl, JSON.stringify(header), JSON.stringify(request.body));
    var res = JSON.parse(res);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });