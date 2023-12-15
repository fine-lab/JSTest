let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = {
      id: "youridHere",
      compositions: [
        {
          name: "orderDetails",
          compositions: []
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("voucher.order.Order", object);
    let aa = res.orderDetails[0].id;
    throw new Error("查询结果的子表id为：" + aa);
  }
}
exports({ entryPoint: MyTrigger });