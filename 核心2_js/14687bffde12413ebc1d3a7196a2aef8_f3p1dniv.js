let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //使用公共函数--------------begin
    let func1 = extrequire("GT19153AT99.openapi.getAccessToken");
    let res = func1.execute(request);
    //使用公共函数--------------end
    var token = res.access_token;
    var yhtUserId = request.yhtUserId; //友互通的id
    // 使用友互通id
    var requrl = "https://www.example.com/" + token + "&yhtUserId=" + yhtUserId;
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