let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前登录的用户信息
    let funcuser = extrequire("GT16037AT2.process.getCurrentStaffInfo");
    let userInfo = funcuser.execute(request);
    //获取开放平台token
    let func1 = extrequire("GT16037AT2.process.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var deptId = userInfo.res.deptId;
    var requrl = "https://www.example.com/" + token + "&id=" + deptId;
    var strResponse = postman("GET", requrl, null);
    var responseObj = JSON.parse(strResponse);
    var branchleader;
    if ("200" == responseObj.code) {
      var deptDetail = responseObj.data;
      branchleader = { id: deptDetail.branchleader, name: deptDetail.branchleader_name };
    }
    return { res: branchleader };
  }
}
exports({ entryPoint: MyAPIHandler });