let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var reqkhdetailurl = "https://www.example.com/" + token + "&id=" + request;
    let returnData = {};
    var khcustResponse = postman("GET", reqkhdetailurl, JSON.stringify(header), null);
    var kehucustresponseobj = JSON.parse(khcustResponse);
    if ("200" == kehucustresponseobj.code) {
      returnData = kehucustresponseobj.data;
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });