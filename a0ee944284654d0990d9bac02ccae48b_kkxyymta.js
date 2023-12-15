let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var tenantid = request.tenantid;
    const dataCenterUrl = "https://www.example.com/" + tenantid;
    let gatewayUrl = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(gatewayUrl);
    let apiPrefix = responseJson.data.gatewayUrl;
    //商开： https://sy01gsp.yonisv.com/be
    //核心1: https://stage-sy01gsp.yonisv.com/be
    //核心2：https://sy01gsp-pro.yonisv.com/be
    //核心3：https://core3-sy01gsp.yonisv.com/be
    //默认沙箱环境
    var apiRestPre = "";
    //商开环境
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    //核心1
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    //核心2
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    //核心3
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    return { apiRestPre };
  }
}
exports({ entryPoint: MyAPIHandler });