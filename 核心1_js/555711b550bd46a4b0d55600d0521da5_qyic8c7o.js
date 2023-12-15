let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var isAdmin = false;
    var adminList = ["https://www.example.com/", "https://www.example.com/", "https://www.example.com/", "https://www.example.com/"];
    if (adminList.indexOf(currentUser.email) > -1) {
      isAdmin = true;
    }
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    var resultJSON = JSON.parse(result);
    var userInfo = "";
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      // 组装入参的json对象（不要传string）
      userInfo = userData[currentUser.id];
    } else {
      throw new Error("获取员工信息异常");
    }
    return { currentUser: userInfo, isAdmin, yhtId: currentUser.id };
  }
}
exports({ entryPoint: MyAPIHandler });