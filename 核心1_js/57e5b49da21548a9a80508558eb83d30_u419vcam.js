let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstbusinessplanractTrigger {
  execute(context, param) {
    let apiResponse = apiman("get", "https://www.example.com/", null, null);
    return {};
  }
}
exports({ entryPoint: MyTrigger });