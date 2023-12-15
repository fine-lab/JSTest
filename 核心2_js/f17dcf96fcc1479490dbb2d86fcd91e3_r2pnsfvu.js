let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    postman("GET", "https://www.example.com/" + param, null, null);
    return {};
  }
}
exports({ entryPoint: MyTrigger });