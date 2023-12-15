let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let currentUser = JSON.parse(AppContext()).currentUser;
    let sysId = "yourIdHere";
    let tenantId = currentUser.tenantId;
    let userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    let resultJSON = JSON.parse(result);
    let userid;
    let username;
    if ("1" == resultJSON.status) {
      //根据当前用户信息去查询员工表
      let userData = resultJSON.data;
      if (userData && userData[currentUser.id]) {
        //业务系统员工id
        userid = userData[currentUser.id].id;
        username = userData[currentUser.id].name;
      } else {
        throw new Error("未找到用户id：" + currentUser.id + "对应的员工信息");
      }
    } else {
      throw new Error("获取员工信息异常");
    }
    return { userid: userid, username: username };
  }
}
exports({ entryPoint: MyAPIHandler });