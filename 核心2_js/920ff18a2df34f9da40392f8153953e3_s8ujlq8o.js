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
    var envUrl = context;
    //对于客开而言，只有沙箱环境（商用开发环境）和生产环境
    var sandbox = "dbox.diwork.com";
    var envParam = "sandbox"; //默认沙箱
    if (envUrl.indexOf(sandbox) == -1) {
      //说明当前环境是生产
      var apiGetAddUrl = configParams.apiurl.getGatewayAddress + "?tenantId=" + currentUser.tenantId;
      var apiResponse = openLinker("GET", apiGetAddUrl, appcode, JSON.stringify({}));
      var res = JSON.parse(apiResponse);
      configParams.gatewayUrl = res.data.gatewayUrl;
      configParams.tokenUrl = res.data.tokenUrl + configParams.apiurl.tokenUri;
    } else {
      configParams.gatewayUrl = "https://www.example.com/";
      configParams.tokenUrl = "https://www.example.com/";
    }
    return { configParams };
  }
}
exports({ entryPoint: MyTrigger });