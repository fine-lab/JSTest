let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    var data = param.data[0];
    var orderDetails = data.purchaseOrders;
    var url = "pu.purchaseorder.PurchaseOrdersCustomItem";
    for (let i = 0; i < orderDetails.length; i++) {
      let datas = orderDetails[i];
      var id = orderDetails[i].id;
      //给普通字段赋值
      datas.set("productDesc", "联想笔记本电脑");
      //给自定义项字段赋值
    }
    return { code: "200" };
  }
}
exports({ entryPoint: MyTrigger });