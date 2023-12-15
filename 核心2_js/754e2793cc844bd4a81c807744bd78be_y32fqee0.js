let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取传过来的inventory对象
    let inventory = request.inventory;
    let id = request.id;
    var object = { id: id, quantity: inventory.quantity, batch_nbr: inventory.batch_nbr };
    var res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.upsInventory", object, "yb71490dae");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });