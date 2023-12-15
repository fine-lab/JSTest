let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取销售订单与出货单
    let order = null; // 销售单
    let deliveryArr = null; // 出货单列表
    if ("2" == request.targetType) {
      let querySql = "select id,code,creator,corpContactUserName,createDate from voucher.order.Order where code = '" + request.targetCode + "'";
      let dataArr = ObjectStore.queryByYonQL(querySql, "udinghuo");
      if (0 == dataArr.length) {
        return {};
      }
      order = dataArr[0];
      let id = order.id;
      let queryDeliverySql = "select id,code,creator,orderId from voucher.delivery.DeliveryVoucher where sourceType = 'voucher_order' and orderId = '" + id + "'";
      deliveryArr = ObjectStore.queryByYonQL(queryDeliverySql, "udinghuo");
    } else if ("1" == request.targetType) {
      let querySql = "select id,code,creator,orderId from voucher.delivery.DeliveryVoucher where sourceType = 'voucher_order' and code = '" + request.targetCode + "'";
      let dataArr = ObjectStore.queryByYonQL(querySql, "udinghuo");
      if (0 == dataArr.length) {
        return {};
      }
      // 获取销售订单号（编码）
      let getOrderCode = "select code,creator,corpContactUserName,createDate from voucher.order.Order where id = '" + dataArr[0].orderId + "'";
      let orderArr = ObjectStore.queryByYonQL(getOrderCode, "udinghuo");
      order = orderArr[0];
      deliveryArr = dataArr;
    }
    return { order: order, deliveryArr: deliveryArr };
  }
}
exports({
  entryPoint: MyAPIHandler
});