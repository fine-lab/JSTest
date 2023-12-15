let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let strResponse = postman("get", "https://www.example.com/" + URLEncoder("条件"), null, null);
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });