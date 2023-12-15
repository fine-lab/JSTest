let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var DOMAIN = "https://www.example.com/"; //https://c2.yonyoucloud.com/iuap-api-gateway
    return DOMAIN;
  }
}
exports({ entryPoint: MyTrigger });