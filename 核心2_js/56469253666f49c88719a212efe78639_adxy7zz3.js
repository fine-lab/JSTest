let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = {
      id: "youridHere",
      compositions: [
        {
          name: "purchaseOrders",
          compositions: []
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("pu.purchaseorder.PurchaseOrder", object);
    let aa = res.purchaseOrders[0].id;
    throw new Error("查询结果的子表id为：" + aa);
  }
}
exports({ entryPoint: MyTrigger });