let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let appcode = "GT100035AT154";
    let data = {
      sandbox: {
        appcode: appcode,
        apiurl: {
          salesDelegate: "https://www.example.com/",
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