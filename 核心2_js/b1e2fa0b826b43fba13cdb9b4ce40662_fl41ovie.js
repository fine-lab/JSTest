let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    postman("post", "https://mail.vmapi.cn:10009/api/post", null, "dddddddddd");
    return {};
  }
}
exports({ entryPoint: MyTrigger });