let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var url = "https://www.example.com/";
    var strResponse = postman("GET", url, null, null);
    throw new Error(strResponse);
    return {};
  }
}
exports({ entryPoint: MyTrigger });