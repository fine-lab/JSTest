let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var strResponse = postman("get", "http://localhost:8090/getPostMan", null, null);
    return {
      strResponse
    };
  }
}
exports({ entryPoint: MyTrigger });