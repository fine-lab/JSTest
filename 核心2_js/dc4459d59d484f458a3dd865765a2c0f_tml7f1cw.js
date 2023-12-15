let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var config = {
      appKey: "yourKeyHere",
      appSecret: "yourSecretHere",
      baseUrl: "https://api.diwork.com",
      updateOrderUrl: "/tml7f1cw/commonProductCls/commonProduct/updateOrder"
    };
    return { config };
  }
}
exports({ entryPoint: MyTrigger });