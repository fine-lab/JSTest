let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = request.object;
    //更新申请单
    try {
      var res = ObjectStore.updateById("GT65292AT10.GT65292AT10.PresaleAppon", object);
    } catch (err) {
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });