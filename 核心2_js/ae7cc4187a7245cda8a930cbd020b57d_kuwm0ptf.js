let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let appcode = "GT100036AT155";
    let data = {
      sandbox: {
        appcode: appcode,
        apiurl: {
          saleDelegate: "https://www.example.com/",
          users: "https://www.example.com/"
        }
      },
      production: {
        appcode: appcode,
        apiurl: {
          salesDelegate: "https://www.example.com/",
          users: "https://www.example.com/"
        }
      }
    };
    let currentEnvParams = data[context];
    return { currentEnvParams };
  }
}
exports({ entryPoint: MyTrigger });