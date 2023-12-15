let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tenantid = ObjectStore.env().tenantId;
    const dataCenterUrl = "https://www.example.com/" + tenantid;
    let gatewayUrl = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(gatewayUrl);
    let apiPrefix = responseJson.data.gatewayUrl;
    //沙箱环境
    var apiRestPre = "https://www.example.com/";
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      //核心三
      apiRestPre = "https://www.example.com/";
    } else if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      //核心一
      apiRestPre = "https://www.example.com/";
    }
    request.tenantId = tenantid;
    var strResponse = postman("post", apiRestPre + "/gsp/saveSySupplier", null, JSON.stringify(request));
    let result = JSON.parse(strResponse);
    if (result.code != "200") {
      throw new Error("查询接口报错！");
    }
    return { result: result };
  }
}
exports({ entryPoint: MyAPIHandler });