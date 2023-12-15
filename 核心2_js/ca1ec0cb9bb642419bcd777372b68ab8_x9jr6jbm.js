let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { orderIds, orderProductIds, queryType } = request;
    if (!orderProductIds && !orderIds) {
      return {};
    }
    var sql;
    if ("orderProduct" == queryType && orderProductIds && orderProductIds.length > 0) {
      //根据产品id查询倒冲入库材料
      sql =
        "select *,orderProductId.orderId.code as code,productId.code as materialCode,skuId.code as skuCode from po.order.OrderMaterial   " +
        " where orderProductId in ( " +
        orderProductIds +
        ") and supplyType = 1 ";
    }
    if ("order" == queryType && orderIds && orderIds.length > 0) {
      //根据订单id查询倒冲入库材料
      sql =
        "select *,orderProductId.orderId.code as code,productId.code as materialCode,skuId.code as skuCode from po.order.OrderMaterial  m " +
        " left join orderProductId  on  orderProductId.id = m.orderProductId " +
        " where orderProductId.orderId in (" +
        orderIds +
        ") and supplyType = 1 ";
    }
    var res = ObjectStore.queryByYonQL(sql);
    if (res) {
      return { res };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });