let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var orgId = request.orgId; //组织id
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var body = { externalData: { parentorgid: orgId, enable: 1 } };
    var reqkhdetailurl = "https://www.example.com/" + token;
    let returnData = {};
    var khcustResponse = postman("POST", reqkhdetailurl, JSON.stringify(header), JSON.stringify(body));
    var kehucustresponseobj = JSON.parse(khcustResponse);
    if ("200" == kehucustresponseobj.code) {
      var resdata = kehucustresponseobj.data;
      if (resdata.length > 0) {
        for (var i = 0; i < resdata.length; i++) {
          if (request.code == resdata[i].code) {
            returnData = resdata[i];
          }
        }
      }
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });