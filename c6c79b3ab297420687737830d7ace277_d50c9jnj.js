let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var appcode = "121412";
    var appKey = "yourKeyHere";
    var appSecret = "yourSecretHere";
    var data = {
      appcode: appcode,
      appKey: appKey,
      gatewayUrl: "",
      appSecret: appSecret,
      tenantId: currentUser.tenantId,
      code: currentUser.code,
      tokenUrl: "",
      apiurl: {
        getGatewayAddress: "https://www.example.com/",
        postreqUri: "/yonbip/cpu/pureq/postreq",
        tokenUri: "/open-auth/suiteApp/getAccessToken"
      }
    };
    var configParams = data;
    //对于客开而言，只有沙箱环境（商用开发环境）和生产环境
    configParams.gatewayUrl = "https://www.example.com/";
    return { configParams };
  }
}
exports({ entryPoint: MyTrigger });