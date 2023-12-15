//实体查询
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var userId = request.userId;
    var object = { outKeyId: userId };
    var res = ObjectStore.selectByMap("Ith1.Ith1.Ith1_user", object);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });