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
    let body = { phone: request.phone };
    let parambase = openLinker("post", buzUrl + "/po8haf1l/crmApi/system/memberQuery", "SDMB", JSON.stringify(body));
    parambase = parambase.replace('"', "");
    console.log(parambase);
    return { parambase };
  }
}
exports({ entryPoint: MyAPIHandler });