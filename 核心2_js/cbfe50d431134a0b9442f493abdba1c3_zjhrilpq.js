let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let apiResponse = apiman("POST", "https://www.example.com/", '{"apicode":"GT1671AT14"}', null);
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });