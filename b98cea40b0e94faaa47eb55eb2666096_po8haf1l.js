let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    console.log(buzUrl);
    console.log("获取token");
    let body = { appKey: "yourKeyHere", appSecret: "yourSecretHere" };
    let header = { "Content-Type": "application/json" };
    let func1 = extrequire("SDMB.base.getToken");
    let restoken = func1.execute();
    var token = restoken.access_token;
    let res = postman("POST", buzUrl + "/po8haf1l/crmApi/system/getCrmToken?access_token=" + token, JSON.stringify(header), JSON.stringify(body));
    res = JSON.parse(res);
    console.log(res);
    var ysbody = { code: "thirdToken", value: res.data };
    var ysheader = {};
    var apiResponse = openLinker("post", buzUrl + "/po8haf1l/crmApi/parambase/paramUpdate", "SDMB", JSON.stringify(ysbody));
    console.log(apiResponse);
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });