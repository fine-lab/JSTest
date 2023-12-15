let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    let res1 = JSON.parse(res);
    let tid = res1.currentUser.tenantId;
    let body = {};
    let url = `https://c2.yonyoucloud.com/iuap-api-gateway/${tid}/commonProductCls/commonProduct/api0823`;
    let apiResponse = openLinker("POST", url, "GT23196AT14", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });