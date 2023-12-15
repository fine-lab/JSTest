let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = ["97167f71-d697-4d95-bfce-0cfc8309441f"];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    var resultJSON = JSON.parse(result);
    throw new Error(JSON.stringify(result));
    var userid;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id; //员工id
    } else {
      throw new Error("获取员工信息异常");
    }
    return { res: userid };
  }
}
exports({ entryPoint: MyTrigger });