let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var tenantId = JSON.parse(AppContext()).currentUser.tenantId;
    var sql = "select gatewayUrl from GT31545AT9.GT31545AT9.datacenter where infTenantId='" + tenantId + "'";
    var gatewayUrl = ObjectStore.queryByYonQL(sql);
    var strResponse;
    var buzUrl = "";
    if (gatewayUrl.length != 0) {
      //默认取第一条数据
      buzUrl = gatewayUrl[0].gatewayUrl;
    } else {
      //查询多数据中心域名
      var dataCenterUrl = "https://www.example.com/" + tenantId;
      strResponse = postman("get", dataCenterUrl, null, null);
      var responseJson = JSON.parse(strResponse);
      buzUrl = responseJson.data.gatewayUrl;
      //插入数据
      var insertObject = { infTenantId: tenantId, gatewayUrl: buzUrl };
      ObjectStore.insert("GT31545AT9.GT31545AT9.datacenter", insertObject, "2f88ee3b");
    }
    let openApiUrl = extrequire("GT31545AT9.backDesignerFunction.getOpenAPIUrl");
    let res = openApiUrl.execute(context.apiurlKey);
    return { url: buzUrl + res.apiurl, appcode: res.appcode };
  }
}
exports({ entryPoint: MyTrigger });