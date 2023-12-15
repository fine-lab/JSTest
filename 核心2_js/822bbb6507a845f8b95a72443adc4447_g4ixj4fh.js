let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前人的员工id---------------------begin
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    var resultJSON = JSON.parse(result);
    var userData = resultJSON.data;
    //业务系统员工id
    let psnid = userData[currentUser.id].id; //员工id -----------------end
    //单据的billnum
    let billnum = request.billnum;
    //获取当前登录人的员工信息
    let sql =
      "select cItemName,limit_hidden_id.billnum as bullnum,limit_hidden_id.limit_hidden_psnList.psn as psn, " +
      " isMain, childrenField,limit_hidden_id.isList as isList" +
      " from GT9037AT11.GT9037AT11.hiddenParams " +
      " where limit_hidden_id.billnum='" +
      billnum +
      "' and limit_hidden_id.limit_hidden_psnList.psn='" +
      psnid +
      "'";
    var res = ObjectStore.queryByYonQL(sql);
    //根据当前的返回结果判断是否在被禁用权限清单中
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });