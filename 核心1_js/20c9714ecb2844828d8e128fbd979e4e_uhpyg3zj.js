let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = {
      ids: ["1850734273334607873"]
    };
    //实体查询
    var res = ObjectStore.selectBatchIds("voucher.order.Order", object, "udinghuo");
    return { res };
  }
}
exports({ entryPoint: MyTrigger });