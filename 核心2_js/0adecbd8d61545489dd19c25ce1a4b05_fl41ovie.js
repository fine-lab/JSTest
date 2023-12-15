let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let apiResponse = apiman("get", "https://www.example.com/", '{"apicode":"4458bd094109421ab981fd5df0ee17b0"}', null);
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });