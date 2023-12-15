let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let currentUser = JSON.parse(AppContext()).currentUser;
    let sysId = "yourIdHere";
    let tenantId = currentUser.tenantId;
    let userIds = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userIds);
    let resultJSON = JSON.parse(result);
    let userId, userName;
    if (resultJSON.status == "1") {
      //根据当前用户信息去查询员工表
      let userData = resultJSON.data;
      if (userData && userData[currentUser.id]) {
        //业务系统员工id
        userId = userData[currentUser.id].id;
        userName = userData[currentUser.id].name;
      } else {
        throw new Error("未找到用户id：" + currentUser.id + "对应的员工信息");
      }
    } else {
      throw new Error("获取员工信息异常");
    }
    return { userId, userName };
  }
}
exports({ entryPoint: MyAPIHandler });