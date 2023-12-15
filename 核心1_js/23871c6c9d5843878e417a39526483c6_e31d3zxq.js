let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var date = "password";
    //秘钥
    var key = "123";
    var res = HmacSHA256(date, key);
    return res;
  }
}
exports({ entryPoint: MyTrigger });