let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function log(msg) {
      let logfunc = extrequire("GT9912AT31.common.logInfo");
      let type = typeof msg;
      if (type == "string") {
        logfunc.execute({ msg });
      } else {
        let outmsg = JSON.stringify(msg);
        logfunc.execute({ msg: outmsg });
      }
    }
    log("unBindRole => \n" + JSON.stringify(request) + "\n");
    var code = request.roleCode;
    var userId = request.userId;
    // 获取当前角色用户信息
    var func1 = extrequire("GT34544AT7.authManager.getRoleByRoleCode");
    request.code = code;
    var res1 = func1.execute(request).res;
    var roleInfo = res1;
    var roleId = roleInfo.roleId;
    var func2 = extrequire("GT34544AT7.authManager.unbindUserAndRole");
    request.userId = userId;
    request.roleId = roleId;
    var res = func2.execute(request).res;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });