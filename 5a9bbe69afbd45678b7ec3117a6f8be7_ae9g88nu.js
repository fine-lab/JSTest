let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let tracCodes = request.tracCodes;
    let ref_ent_id = request.ref_ent_id;
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let url = apiPreAndAppCode.apiPrefix + "/gsp/queryCodeActive";
    let params = {
      tracCodes: tracCodes,
      ref_ent_id: ref_ent_id,
      appKey: "yourKeyHere",
      appSecret: "test",
      serverUrl: "https://www.example.com/"
    };
    let strResponse = postman("post", url, null, JSON.stringify(params));
    return {
      strResponse: strResponse
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});