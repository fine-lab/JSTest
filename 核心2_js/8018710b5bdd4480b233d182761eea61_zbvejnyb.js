let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var userid = currentUser.id;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    var returndata = resultJSON.data[userid];
    if (returndata == undefined) {
      throw new Error("依据当前登陆账户未查询到用户信息！");
    }
    returndata.userid = userid;
    return { returndata };
  }
}
exports({ entryPoint: MyAPIHandler });