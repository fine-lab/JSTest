let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sql = "select * from voucher.order.Order";
    //查询内容
    var object = {
      id: "youridHere"
    };
    //实体查询
    var res = ObjectStore.selectById("voucher.order.Order", object, "udinghuo");
    var object2 = { id: "youridHere", code: "999999" };
    res = ObjectStore.updateById("GT37522AT1.GT37522AT1.espoplan", object2, "espoplan");
    var object1 = { id: "youridHere", headFreeItem: [{ define1: "2", _status: "Update" }] };
    res = ObjectStore.updateById("voucher.order.Order", object1, "udinghuo");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });