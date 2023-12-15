let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var str = "Hello, world!";
    var res = replace(str, "world", "yonyou");
    return res; // Hello, yonyou!
  }
}
exports({ entryPoint: MyTrigger });