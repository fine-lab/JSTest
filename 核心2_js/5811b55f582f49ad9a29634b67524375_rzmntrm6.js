let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT83441AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var id = request;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var reqkhdetailurl = "https://www.example.com/" + token + "&id=" + id;
    let detail = "";
    var returnData = {};
    var khcustResponse = postman("get", reqkhdetailurl, JSON.stringify(header), null);
    var kehucustresponseobj = JSON.parse(khcustResponse);
    if ("200" == kehucustresponseobj.code) {
      detail = kehucustresponseobj.data;
    }
    return { detail };
  }
}
exports({ entryPoint: MyAPIHandler });