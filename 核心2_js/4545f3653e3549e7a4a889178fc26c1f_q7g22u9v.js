let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var config = {
      appkey: "yourkeyHere",
      appSecret: "yourSecretHere",
      sandboxopenapiurl: "https://api.diwork.com",
      currentUser: currentUser
    };
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    config["result"] = resultJSON;
    var userid;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      if (JSON.stringify(resultJSON.data) != "{}") {
        userid = userData[currentUser.id].id;
      } else {
        userid = "";
      }
    } else {
      throw new Error("获取员工信息异常");
    }
    config["userid"] = userid;
    return { config };
  }
}
exports({ entryPoint: MyAPIHandler });