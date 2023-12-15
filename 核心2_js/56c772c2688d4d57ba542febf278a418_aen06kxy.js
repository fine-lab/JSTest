let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var config = {
      appCode: "IDX_02", //7ffff8dd-f657-4fa1-a2ef-fb1d78862646
      domainKey: "yourKeyHere",
      appKey: "yourKeyHere",
      appSecret: "yourSecretHere",
      baseUrl: "https://open-api-dbox.yyuap.com",
      apiUrl: "https://www.example.com/"
    };
    return { config };
  }
}
exports({ entryPoint: MyAPIHandler });