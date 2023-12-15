let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return postman("get", "https://www.baidu.com", null, null);
  }
}
exports({ entryPoint: MyTrigger });