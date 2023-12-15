let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var id = request.id;
    var merchantApplyRangeId = request.merchantApplyRangeId;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var reqkhdetailurl = "https://www.example.com/" + token + "&id=" + id + "&merchantApplyRangeId=" + merchantApplyRangeId;
    let detail = "";
    var khcustResponse = postman("get", reqkhdetailurl, JSON.stringify(header), null);
    var kehucustresponseobj = JSON.parse(khcustResponse);
    if ("200" == kehucustresponseobj.code) {
      detail = kehucustresponseobj.data;
    }
    return { data: detail };
  }
}
exports({ entryPoint: MyAPIHandler });