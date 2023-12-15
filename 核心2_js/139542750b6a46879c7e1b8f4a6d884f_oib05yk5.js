let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = {
      id: "youridHere"
    };
    //实体查询
    var res = ObjectStore.selectById("GT44022AT26.GT44022AT26.simple2021082013", object);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });