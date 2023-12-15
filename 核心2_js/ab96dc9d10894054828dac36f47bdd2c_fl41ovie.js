let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var strResponse = postman("post", "https://localhost:8080/mail/supplier/test1030", JSON.stringify(""), JSON.stringify(param.data));
    return {};
  }
}
exports({ entryPoint: MyTrigger });