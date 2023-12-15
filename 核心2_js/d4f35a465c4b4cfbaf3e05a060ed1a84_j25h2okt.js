let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = request;
    var body = {
      pageIndex: "1",
      pageSize: "1",
      code: code
    };
    let func1 = extrequire("GT101792AT1.common.getApiToken");
    let res = func1.execute();
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    var reqCgdetailurl = "https://www.example.com/" + token;
    var cgResponse = postman("POST", reqCgdetailurl, JSON.stringify(header), JSON.stringify(body));
    var cgresponseobj = JSON.parse(cgResponse);
    return { cgresponseobj };
  }
}
exports({ entryPoint: MyAPIHandler });