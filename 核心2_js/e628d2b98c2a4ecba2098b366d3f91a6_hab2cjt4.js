let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    //查询内容
    var object = {
      compositions: [
        {
          constructor: id
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("GT42921AT2.GT42921AT2.constructorInfo", object);
    if (!res) {
      throw new Error("获取承揽商信息异常");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });