let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    var userid;
    var allData;
    var deptid;
    var deptCode;
    var orgid;
    var usercode;
    var token = "";
    let func1 = extrequire("e981ac6420ce46518477aa845d392f1b");
    let res = func1.execute(request);
    token = res.access_token;
    let apiResponsedepttwo = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(depttwo));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });