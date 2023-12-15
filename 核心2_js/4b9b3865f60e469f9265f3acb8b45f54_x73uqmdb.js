let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = {
      id: "youridHere"
    };
    //实体查询
    var res = ObjectStore.selectById("GT79146AT92.GT79146AT92.funcStore", object);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });