let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var appcode = context.appcode;
    let envSystemUrl = ObjectStore.env().url;
    var data = {
      appcode: appcode,
      gatewayUrl: "",
      envUrl: envSystemUrl,
      tenantId: currentUser.tenantId,
      code: currentUser.code,
      tokenUrl: "",
      apiurl: {
        getGatewayAddress: "https://www.example.com/",
        postreqUri: "/yonbip/cpu/pureq/postreq",
        tokenUri: "/open-auth/suiteApp/getAccessToken",
        fixedasset: "/yonbip/EFI/AdditionBill/save"
      }
    };
    var configParams = data;
    var envUrl = context.envUrl;
    configParams.gatewayUrl = envSystemUrl + "/iuap-api-gateway";
    return { configParams };
  }
}
exports({ entryPoint: MyTrigger });