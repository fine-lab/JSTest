let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let url = apiPreAndAppCode.apiPrefix + "/gsp/uploadInOutBill";
    data.appKey = "yourKeyHere";
    data.appSecret = "test";
    data.serverUrl = "https://www.example.com/";
    let strResponse = postman("post", url, null, JSON.stringify(data));
    return {
      strResponse: strResponse
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});