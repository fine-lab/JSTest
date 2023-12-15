let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = {
      sandbox: {
        appcode: "GT6948AT29",
        baseApiUrl: "https://open-api-dbox.yyuap.com"
      },
      production: {
        appcode: "GT6948AT29",
        baseApiUrl: "https://api.diwork.com"
      }
    };
    let currentEnvParams = data[context];
    return { currentEnvParams };
  }
}
exports({ entryPoint: MyTrigger });