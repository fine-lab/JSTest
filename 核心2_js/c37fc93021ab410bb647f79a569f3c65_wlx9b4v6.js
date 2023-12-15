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
    let returnData = {};
    if ("1" == resultJSON.status) {
      var userDatas = resultJSON.data;
      var useridrole = userDatas[userid];
      returnData.code = 200;
      returnData.orgId = useridrole.orgId;
      returnData.orgName = useridrole.orgName;
      returnData.message = "查询成功！";
    } else {
      returnData.code = 999;
      returnData.message = resultJSON.msg;
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });