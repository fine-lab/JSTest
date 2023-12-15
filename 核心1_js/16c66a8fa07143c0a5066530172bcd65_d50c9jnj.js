let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var appcode = "GT37595AT2";
    var data = {
      appcode: appcode,
      gatewayUrl: "",
      tenantId: currentUser.tenantId,
      code: currentUser.code,
      tokenUrl: "",
      apiurl: {
        getGatewayAddress: "https://www.example.com/",
        postreqUri: "/yonbip/cpu/pureq/postreq",
        tokenUri: "/open-auth/selfAppAuth/getAccessToken"
      }
    };
    var configParams = data;
    configParams.gatewayUrl = "https://www.example.com/";
    configParams.tokenUrl = "https://www.example.com/" + configParams.apiurl.tokenUri;
    return { configParams };
  }
}
exports({ entryPoint: MyTrigger });