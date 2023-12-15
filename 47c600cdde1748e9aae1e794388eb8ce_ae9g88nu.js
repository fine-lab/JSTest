let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code_list = request.code_list;
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let url = apiPreAndAppCode.apiPrefix + "/gsp/getBarCode";
    let paramsObj = {
      code_list: code_list,
      appKey: "yourKeyHere",
      appSecret: "test",
      serverUrl: "https://www.example.com/"
    };
    let strResponse = postman("post", url, null, JSON.stringify(paramsObj));
    return { strResponse: strResponse };
  }
}
exports({
  entryPoint: MyAPIHandler
});