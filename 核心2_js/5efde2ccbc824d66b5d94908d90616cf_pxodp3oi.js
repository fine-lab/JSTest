let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var DOMAIN = "https://www.example.com/";
    return DOMAIN;
  }
}
exports({ entryPoint: MyTrigger });