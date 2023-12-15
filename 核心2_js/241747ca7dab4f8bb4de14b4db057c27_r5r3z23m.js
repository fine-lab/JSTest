let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = {
      id: "youridHere"
    };
    //实体查询
    var res = ObjectStore.selectById("pc.product.ProductDefine", object);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });