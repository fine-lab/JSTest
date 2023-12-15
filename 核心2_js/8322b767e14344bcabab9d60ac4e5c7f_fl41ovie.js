let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute() {
    let apiResponse = apiman("get", "https://www.example.com/", '{"apicode":"217ced6a86c443df817e7a0d579bc7ed"}', null);
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });