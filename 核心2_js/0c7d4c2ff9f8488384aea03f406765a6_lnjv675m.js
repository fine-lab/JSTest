let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT53685AT3.common.getOpenApiToken");
    let resFun1 = func1.execute({ appId: request.appId });
    //使用公共函数--------------end
    var token = resFun1.access_token;
    var requrl = resFun1.config.baseApiUrl + request.uri + "?access_token=" + token;
    if (request.parm !== undefined) {
      let parms = request.parm;
      let i = 0;
      for (let key in parms) {
        let value = parms[key];
        requrl += "&" + UrlEncode(key) + "=" + UrlEncode(value);
        i++;
      }
    }
    const header = {
      "Content-Type": "application/json"
    };
    let method = !!request.method ? request.method : "post";
    let body = !!request.body ? (Object.keys(request.body).length > 0 ? JSON.stringify(request.body) : "{}") : method == "post" ? "{}" : null;
    let apiResponse = postman(method, requrl, JSON.stringify(header), body);
    var res = JSON.parse(apiResponse);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });