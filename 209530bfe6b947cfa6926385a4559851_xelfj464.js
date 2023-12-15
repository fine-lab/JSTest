let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //声明变量开始
    let currencyId = "yourIdHere";
    let body = {
      data: [
        {
          id: currencyId
        }
      ]
    };
    const rootUrl = "https://c1.yonyoucloud.com";
    let requestUrl = `${rootUrl}/iuap-api-gateway/yonbip/digitalModel/currency/delete`;
    let requestMethod = "POST";
    let appCode = "AT17A1A51817800007";
    let apiResponse = openLinker(requestMethod, requestUrl, appCode, JSON.stringify(body));
    var result = JSON.parse(apiResponse);
    return {
      result
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});