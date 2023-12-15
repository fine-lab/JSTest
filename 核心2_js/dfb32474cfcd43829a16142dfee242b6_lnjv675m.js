let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT54365AT15.common.getOpenApiToken");
    let resFun1 = func1.execute(request);
    let configfun = extrequire("GT54365AT15.common.baseconfig");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var token = resFun1.access_token;
    var requrl = config.config.baseApiUrl + request.uri + "?access_token=" + token;
    let parm = request.parm;
    if (parm !== undefined && parm !== null) {
      for (let key in parm) {
        let value = parm[key];
        requrl += "&" + key + "=" + value;
      }
    }
    const header = {
      "Content-Type": "application/json"
    };
    var accept = postman("get", requrl, JSON.stringify(header), null);
    var res = JSON.parse(accept);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });