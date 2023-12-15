let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //每次最多500个
    var list = request.list;
    if (!list || list.length == 0) {
      throw new Error("参数不能为空");
    }
    if (list.length > 500) {
      throw new Error("每次最多传入500个id");
    }
    var res = ObjectStore.updateBatch("AT161E5DFA09D00001.AT161E5DFA09D00001.upsInventory", list, "yb71490dae");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });