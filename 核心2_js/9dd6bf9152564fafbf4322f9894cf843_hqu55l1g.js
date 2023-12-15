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
    var body = {
      pageSize: 100,
      pageIndex: 1,
      code: request
    };
    var reqkhdetailurl = "https://www.example.com/" + token;
    let detail = {};
    var khcustResponse = postman("POST", reqkhdetailurl, JSON.stringify(header), JSON.stringify(body));
    var kehucustresponseobj = JSON.parse(khcustResponse);
    if ("200" == kehucustresponseobj.code) {
      var recordListData = kehucustresponseobj.data.recordList;
      if (recordListData.length > 0) {
        detail = recordListData[0];
      }
    }
    return { detail };
  }
}
exports({ entryPoint: MyAPIHandler });