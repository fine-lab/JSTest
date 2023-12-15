let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var warehouseCode = request.code;
    var orgId = request.orgId;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var body = {
      pageSize: 100,
      pageIndex: 1,
      code: warehouseCode,
      org: orgId
    };
    var reqkhdetailurl = "https://www.example.com/" + token;
    let returnData = {};
    var khcustResponse = postman("POST", reqkhdetailurl, JSON.stringify(header), JSON.stringify(body));
    var kehucustresponseobj = JSON.parse(khcustResponse);
    if ("200" == kehucustresponseobj.code) {
      var resdata = kehucustresponseobj.data.recordList;
      if (resdata.length > 0) {
        returnData = resdata[0];
      }
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });