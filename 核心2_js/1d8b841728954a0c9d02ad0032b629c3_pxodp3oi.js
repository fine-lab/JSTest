let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var DOMAIN = "https://www.example.com/"; //https://dbox.diwork.com/iuap-api-gateway //  https://www.yonyoucloud.com/iuap-api-gateway//c2.yonyoucloud.com
    return DOMAIN;
  }
}
exports({ entryPoint: MyTrigger });