let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param = request;
    let func1 = extrequire("ACT.FollowRecord.getAccessToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let url = "https://www.example.com/" + token;
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(param));
    var resp = JSON.parse(strResponse);
    return resp;
  }
}
exports({ entryPoint: MyAPIHandler });