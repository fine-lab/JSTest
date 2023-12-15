let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //声明变量开始
    let body = {
      pageIndex: 1,
      pageSize: 10,
      isSum: false
    };
    //声明变量结束
    const rootUrl = "https://c1.yonyoucloud.com";
    let requestUrl = `${rootUrl}/iuap-api-gateway/yonbip/sd/voucherorder/list`;
    let requestMethod = "POST";
    let appCode = "AT18AEA98817580006";
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