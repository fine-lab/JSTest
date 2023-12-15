let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var config = {
      appKey: "yourKeyHere",
      appSecret: "yourSecretHere",
      baseUrl: "https://api.diwork.com",
      updateOrderUrl: "/o6fhk7a3/commonProductCls/commonProduct/updateOrder"
    };
    return { config };
  }
}
exports({ entryPoint: MyTrigger });