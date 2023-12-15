let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = { id: request.id };
    //实体查询
    var res = ObjectStore.selectById("GT27606AT15.GT27606AT15.HBZXM", object);
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });