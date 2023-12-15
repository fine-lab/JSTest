let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    var resultJSON = JSON.parse(result);
    //获取当前登录用户名称
    var UserName = currentUser.name;
    //通过用户名称查询业绩
    var sql = "select ziduan2 from GT10891AT368.GT10891AT368.quyufuzeren where quyufuzeren = '" + UserName + "' ";
    var res = ObjectStore.queryByYonQL(sql);
    return { Target: res, UserName: UserName };
  }
}
exports({ entryPoint: MyAPIHandler });