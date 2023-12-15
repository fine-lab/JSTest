let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = { id: updateId, shuliang: 24, useshuliang: 24, surplus: 0 };
    var res = ObjectStore.updateById("GT65690AT1.GT65690AT1.prjMaterRelevance_a", object, "675a835b");
    return { res };
    //删除子表
  }
}
exports({ entryPoint: MyAPIHandler });