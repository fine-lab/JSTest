let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = null;
    let loginUserId = "yourIdHere";
    let loginUserName = "董利婷";
    let ip = "118.76.22.111";
    let device = "1";
    let endDate = "2023-07-14 08:35:38";
    let page = 1;
    let size = 10;
    const rootUrl = "https://c1.yonyoucloud.com";
    let requestUrl = `${rootUrl}/iuap-api-gateway/yonbip/digitalModel/log-pub/login/rest/query?loginUserName=董利婷&size=10&ip=118.76.22.111&loginUserId=YHT-79050-790561683518649731&page=1&device=1`;
    let requestMethod = "GET";
    let appCode = "AT1860273016E80004";
    let apiResponse = openLinker(requestMethod, requestUrl, appCode, body);
    var result = JSON.parse(apiResponse);
    return {
      result
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});