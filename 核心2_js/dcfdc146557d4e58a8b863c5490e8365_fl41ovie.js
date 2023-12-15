let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var str = "Hello world!";
    return substring(str, 1, 3); //el
  }
}
exports({ entryPoint: MyTrigger });