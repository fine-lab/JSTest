let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let responseObj = postman("get", "https://www.example.com/", "", "");
    return { responseObj };
  }
}
exports({ entryPoint: MyTrigger });