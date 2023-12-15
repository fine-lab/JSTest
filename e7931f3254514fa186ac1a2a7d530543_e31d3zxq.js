let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取当前任务的租户ID
    var orgid = null;
    var tenantid = context.tenantid;
    //获取当前租户所在数据中心gatewayUrl
    const dataCenterUrl = "https://www.example.com/" + tenantid;
    let gatewayUrl = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(gatewayUrl);
    let apiPrefix = responseJson.data.gatewayUrl;
    var appcontext = JSON.parse(AppContext());
    var currentuser = appcontext.currentUser;
    var userid = currentuser.id;
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
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    //核心三
    if (apiPrefix == "https://www.example.com/") {
      apiRestPre = "https://www.example.com/";
    }
    var obj = { tenantId: tenantid, orgId: orgid, userId: userid };
    var strResponse = postman("post", apiRestPre + "/task/autoAuditCustomerOrder", null, JSON.stringify(obj));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });