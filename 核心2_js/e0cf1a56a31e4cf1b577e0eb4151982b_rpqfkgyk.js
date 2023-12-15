let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = {
      id: request.id
    };
    //实体查询
    var res = ObjectStore.selectById("GT96555AT4.GT96555AT4.user125323", object);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });