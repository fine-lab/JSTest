let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let start_date = request.start_date;
    let end_date = request.end_date;
    // 获取当前任务的租户ID
    let tenantid = ObjectStore.env().tenantId;
    //获取当前租户所在数据中心gatewayUrl
    const dataCenterUrl = "https://www.example.com/" + tenantid;
    let gatewayUrl = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(gatewayUrl);
    let apiPrefix = responseJson.data.gatewayUrl;
    //沙箱环境
    var apiRestPre = "https://www.example.com/";
    if (apiPrefix == "https://www.example.com/") {
      //核心三
      apiRestPre = "https://www.example.com/";
    } else if (apiPrefix == "https://www.example.com/") {
      //核心一
      apiRestPre = "https://www.example.com/";
    }
    request.queryUrl = "purinOutRecord";
    request.tenantId = tenantid;
    var strResponse = postman("post", apiRestPre + "/gsp/purinRecord", null, JSON.stringify(request));
    let result = JSON.parse(strResponse);
    if (result.code != "200") {
      throw new Error("查询红字采购入库报错！");
    }
    return { result: result.list };
  }
}
exports({ entryPoint: MyAPIHandler });