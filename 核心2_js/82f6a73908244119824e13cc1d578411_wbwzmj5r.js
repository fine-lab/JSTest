let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var reqBodyData = request.reqBody;
    var uri = request.uri;
    //获取开放平台token
    let tokenFun = extrequire("GT66350AT5.common.getOpenApiToken");
    let tokenRes = tokenFun.execute(request);
    var access_token = tokenRes.access_token;
    //获取配置文件基础路径
    let configFun = extrequire("GT66350AT5.common.config");
    let configRes = configFun.execute(request);
    var baseUrl = configRes.config.baseUrl;
    var useUrl = baseUrl + uri + "?access_token=" + access_token;
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var strResponse = postman("POST", useUrl, JSON.stringify(header), JSON.stringify(reqBodyData));
    var responseObj = JSON.parse(strResponse);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });