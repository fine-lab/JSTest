let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let appcode = "AT1598793A09B00005";
    let data = {
      sandbox: {
        appcode: appcode,
        apiurl: {
          salesDelegate: "https://www.example.com/"
        }
      },
      production: {
        appcode: appcode,
        apiurl: {
          salesDelegate: "https://www.example.com/"
        }
      }
    };
    let currentEnvParams = data[context];
    return { currentEnvParams };
  }
}
exports({ entryPoint: MyTrigger });