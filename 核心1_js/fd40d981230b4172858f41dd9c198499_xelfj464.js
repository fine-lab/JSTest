let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = null;
    let startTime = "2022-06-01 12:20:00";
    let endTime = "2023-06-01 12:20:00";
    const rootUrl = "https://c1.yonyoucloud.com";
    let requestUrl = `${rootUrl}/iuap-api-gateway///yonbip/yonbip/digitalModel/exchangeratetype/findByTime?`;
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