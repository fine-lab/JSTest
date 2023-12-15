let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let url = "	https://c2.yonyoucloud.com/iuap-api-gateway/babqz7zj/commonProductCls/commonProduct/testapiinface";
    let apiResponse = openLinker("POST", url, "ST", JSON.stringify(body));
    throw new Error(JSON.stringify(apiResponse));
    return {};
  }
}
exports({ entryPoint: MyTrigger });