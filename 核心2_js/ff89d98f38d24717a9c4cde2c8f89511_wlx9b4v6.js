let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取token
    var token = "";
    let func1 = extrequire("GT56492AT34.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    var userid = request.userid;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype,
      noCipherFlag: true
    };
    var bodyhead = {
      userIds: [userid]
    };
    let apiResponse1ct = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(bodyhead));
    var apiResponse1jsonct = JSON.parse(apiResponse1ct);
    var queryCode1ct = apiResponse1jsonct.code;
    if (queryCode1ct !== "200") {
      throw new Error("错误" + apiResponse1jsonct.message + JSON.stringify(bodyhead));
    } else {
      var billid = apiResponse1jsonct.data[0].userMobile;
    }
    return { billid: billid };
  }
}
exports({ entryPoint: MyAPIHandler });