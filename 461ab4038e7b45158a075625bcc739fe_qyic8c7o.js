let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = {
      id: request.id
    };
    //实体查询
    var res = ObjectStore.selectById("GT65292AT10.GT65292AT10.PresaleAppon", object);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });