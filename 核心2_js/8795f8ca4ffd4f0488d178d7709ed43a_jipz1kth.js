let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    var id = pdata.id;
    var iscallback = pdata.callback;
    //判断是否是订单回写，如果是回写则不执行此操作
    if (iscallback !== "1") {
      var salesOrgId = pdata.salesOrgId;
      var orderDetails = pdata.orderDetails;
      //重新组装数据
      orderDetails.forEach((datad) => {
        if (!datad.bodyItem) {
          datad.set("bodyItem", {});
          datad.bodyItem.set("_entityName", "voucher.order.OrderDetailDefine");
          datad.bodyItem.set("_keyName", "orderDetailId");
          datad.bodyItem.set("_realtype", true);
          datad.bodyItem.set("_status", "Insert");
          datad.bodyItem.set("orderId", datad.orderId + "");
          datad.bodyItem.set("code", datad.code + "");
          datad.bodyItem.set("orderDetailKey", datad.id + "");
          datad.bodyItem.set("orderDetailId", datad.id + "");
        }
        //将订单数量qty的值赋值到原订单数量define11，原含税成交价oriTaxUnitPrice的值赋值到define12，原订单总价oriSum的值赋值到define19复制到自定义项一份
        datad.bodyItem.set("define11", datad.qty + "");
        datad.bodyItem.set("define12", datad.oriTaxUnitPrice + "");
        datad.bodyItem.set("define19", datad.oriSum + "");
      });
    }
  }
}
exports({ entryPoint: MyTrigger });