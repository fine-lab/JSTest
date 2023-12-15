let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let apiResponse = apiman("get", "https://www.example.com/", null, null);
    return {};
  }
}
exports({ entryPoint: MyTrigger });