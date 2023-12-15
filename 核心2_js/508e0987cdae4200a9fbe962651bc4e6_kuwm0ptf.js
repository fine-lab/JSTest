let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT14087AT2.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var deptId = request.id;
    var requrl = "https://www.example.com/" + token + "&id=" + deptId;
    var strResponse = postman("GET", requrl, null);
    var responseObj = JSON.parse(strResponse);
    var deptDetail;
    if ("200" == responseObj.code) {
      deptDetail = responseObj.data;
    }
    return { res: deptDetail };
  }
}
exports({ entryPoint: MyAPIHandler });