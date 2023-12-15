let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询内容
    var object = {
      id: request.cloudBillNo
    };
    //实体查询
    var res = ObjectStore.selectById("AT164684BCA6980005.AT164684BCA6980005.gaiqianchaobiao", object);
    return {
      res
    };
  }
}
exports({ entryPoint: MyAPIHandler });