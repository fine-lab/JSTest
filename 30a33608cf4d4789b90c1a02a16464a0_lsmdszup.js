let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取当前任务的租户ID
    let tenantid = ObjectStore.user().tenantId;
    //获取当前租户所在数据中心gatewayUrl
    const dataCenterUrl = "https://www.example.com/" + tenantid;
    let gatewayUrl = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(gatewayUrl);
    let apiPrefix = responseJson.data.gatewayUrl;
    //沙箱环境
    var apiRestPre = "https://www.example.com/";
    if (apiPrefix != "https://www.example.com/") {
      //生产环境
      apiRestPre = "https://www.example.com/";
    }
    //灰度
    if (tenantid == "fgzxvvu3" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    if (apiPrefix != "https://www.example.com/") {
      //核心三
      apiRestPre = "https://www.example.com/";
    }
    throw new Error(JSON.stringify(request));
    //获取api前缀等信息 参数： 请求方式 ， 地址  ，header ， body
    var strResponse = postman("post", apiRestPre + "/wmsServiceCore/wmsDataReceiveService", null, JSON.stringify(obj));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });