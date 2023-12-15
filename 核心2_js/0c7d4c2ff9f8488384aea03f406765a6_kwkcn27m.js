let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT53685AT3.common.getOpenApiToken");
    let resFun1 = func1.execute(request);
    let configfun = extrequire("GT53685AT3.common.baseconfig");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var token = resFun1.access_token;
    var requrl = config.config.baseApiUrl + request.uri + "?access_token=" + token;
    const header = {
      "Content-Type": "application/json"
    };
    var accept = postman("post", requrl, JSON.stringify(header), JSON.stringify(request.body));
    var res = JSON.parse(accept);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });