let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "https://www.example.com/" + URLEncoder("条件");
    var strResponse = postman("get", url, null, null);
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });