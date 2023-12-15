let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = {
      id: "youridHere"
    };
    //实体查询
    var res = ObjectStore.selectById("AT17B9FBFC09580006.AT17B9FBFC09580006.kk_kekai_guwen", object, "ybc2a3b322");
    return { data: res };
  }
}
exports({ entryPoint: MyAPIHandler });