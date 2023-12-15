let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let sysId = "yourIdHere";
    let tenantId = currentUser.tenantId;
    let userids = [currentUser.id];
    let result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    let resultJSON = JSON.parse(result);
    let test = JSON.stringify(resultJSON);
    throw new Error(test);
    return { test };
  }
}
exports({ entryPoint: MyTrigger });