let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var str = JSON.stringify(param);
    var strResponse = postman("post", "https://172.20.52.114:10009/api/post", str, null);
    return strResponse;
  }
}
exports({ entryPoint: MyTrigger });