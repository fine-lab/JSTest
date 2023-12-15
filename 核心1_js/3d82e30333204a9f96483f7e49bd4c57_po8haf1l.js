let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    console.log("获取token");
    let body = { appKey: "yourKeyHere", appSecret: "yourSecretHere" };
    let header = { "Content-Type": "application/json" };
    let res = postman("POST", buzUrl + "/po8haf1l/crmApi/system/getCrmToken", JSON.stringify(header), JSON.stringify(body));
    res = JSON.parse(res);
    console.log(res);
    var ysbody = { code: "thirdToken", value: res.data };
    var ysheader = {};
    var apiResponse = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/paramUpdate", "SDMB", JSON.stringify(ysbody));
    console.log(apiResponse);
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });