let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ctime = new Date().getTime();
    let stime = request.token_start;
    let token = request.access_token;
    if (stime !== undefined && stime !== null && token !== undefined && token !== null) {
      if (ctime - stime > 7199000) {
        let func1 = extrequire("GT30223AT2.common.getOpenApiToken");
        let resFun1 = func1.execute(request);
        request.access_token = resFun1.access_token;
        request.token_start = resFun1.token_start;
        token = resFun1.access_token;
      }
    } else {
      let func1 = extrequire("GT30223AT2.common.getOpenApiToken");
      let resFun1 = func1.execute(request);
      request.access_token = resFun1.access_token;
      request.token_start = resFun1.token_start;
      token = resFun1.access_token;
    }
    let configfun = extrequire("GT30223AT2.common.baseConfig");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var requrl = config.config.baseApiUrl + request.uri + "?access_token=" + token;
    const header = {
      "Content-Type": "application/json"
    };
    var res1 = postman("post", requrl, JSON.stringify(header), JSON.stringify(request.body));
    var res = JSON.parse(res1);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });