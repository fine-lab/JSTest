let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = { id: "youridHere" };
    var res = ObjectStore.selectById("voucher.order.Order", object);
    //根据id查询数据，返回查询结果
    return { res };
  }
}
exports({ entryPoint: MyTrigger });