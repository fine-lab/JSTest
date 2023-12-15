let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //请求地址
    let tenantId = ObjectStore.user().tenantId;
    var dataCenterUrl = "https://www.example.com/" + tenantId;
    var strResponse = postman("get", dataCenterUrl, null, null);
    var responseJson = JSON.parse(strResponse);
    var buzUrl = responseJson.data.gatewayUrl;
    //获取crmtoken
    let body = { data: request.data };
    var parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/system/sendOederInfo", "SDMB", JSON.stringify(body));
    console.log(parambase);
    return { parambase };
  }
}
exports({ entryPoint: MyAPIHandler });