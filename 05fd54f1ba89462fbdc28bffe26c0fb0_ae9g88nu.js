let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let bill_code = request.bill_code;
    let ref_ent_id = request.ref_ent_id;
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let url = apiPreAndAppCode.apiPrefix + "/gsp/searchStatus";
    let params = {
      bill_code: bill_code,
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