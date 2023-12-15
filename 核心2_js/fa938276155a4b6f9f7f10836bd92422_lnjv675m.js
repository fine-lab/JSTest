let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let userId = request.userId;
    //查询内容
    var object = { sysUserId: userId };
    var res = ObjectStore.selectByMap("GT34544AT7.GT34544AT7.MyRoles", object);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });