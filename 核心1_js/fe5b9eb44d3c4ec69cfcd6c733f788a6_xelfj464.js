let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //声明变量开始
    let body = {};
    body.data = new Array();
    var jsonObj = { id: "youridHere" };
    body.data.push(jsonObj);
    //声明变量结束
    const rootUrl = "https://c1.yonyoucloud.com";
    let requestUrl = `${rootUrl}/iuap-api-gateway/yonbip/sd/scmmp/expense/delete`;
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