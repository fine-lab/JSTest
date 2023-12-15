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
    var currentUser = JSON.parse(AppContext()).currentUser;
    let dataCenterUrl = "https://www.example.com/" + currentUser.tenantId;
    let envResponse = postman("get", dataCenterUrl, null, null);
    var res = JSON.parse(envResponse);
    configParams.gatewayUrl = res.data.gatewayUrl;
    if (configParams.gatewayUrl.indexOf("dbox.diwork.com") != -1) {
      configParams.tokenUrl = res.data.tokenUrl + "/open-auth/selfAppAuth/getAccessToken";
    } else {
      configParams.tokenUrl = res.data.tokenUrl + configParams.apiurl.tokenUri;
    }
    return { configParams };
  }
}
exports({ entryPoint: MyTrigger });