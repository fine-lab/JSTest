let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT53685AT3.common.getOpenApiToken");
    let resFun1 = func1.execute(request);
    //使用公共函数--------------end
    var token = resFun1.access_token;
    var requrl = config.config.baseApiUrl + request.uri + "?access_token=" + token;
    let parm = request.parm;
    if (request.parm !== undefined) {
      let parms = request.parm;
      let i = 0;
      for (let key in parms) {
        let value = parms[key];
        requrl += "&" + key + "=" + UrlEncode(value);
        i++;
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