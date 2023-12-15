let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let appContext = AppContext();
    let obj = JSON.parse(appContext);
    let tid = obj.currentUser.tenantId;
    var sql = "select client_id,client_secret from AT175542E21C400007.AT175542E21C400007.zby_api_config where dr=0 and tenant_id='" + tid + "'";
    var res = ObjectStore.queryByYonQL(sql);
    var url =
      "https://www.example.com/" + res[0].client_id + "&client_secret=" + res[0].client_secret + "&scope=all&resource_id=1";
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = {};
    let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });