let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return {
      domainurl: {
        gatewayUrl: "https://www.example.com/",
        tokenUrl: "https://www.example.com/"
      }
    };
  }
}
exports({ entryPoint: MyTrigger });