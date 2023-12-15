let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var CUSTOMERId = request.CUSTOMER_ID;
    // 执行删除
    var object = { CUSTOMER_ID: CUSTOMERId };
    var res = ObjectStore.deleteByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.Inventory", object, "59d9fd55");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });