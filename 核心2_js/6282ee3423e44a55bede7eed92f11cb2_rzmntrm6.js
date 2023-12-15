let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var proid = request.proid;
    var agentId = request.agentId;
    //查询销售订单订单状态不为“开立”、“审批中”
    let querySql =
      "select oriTaxUnitPrice from voucher.order.OrderDetail where orderId in (select id from voucher.order.Order where agentId=" +
      agentId +
      " and nextStatus not in ('CONFIRMORDER','APPROVING') order by pubts desc) and productId=" +
      proid +
      "  order by pubts desc";
    var res = ObjectStore.queryByYonQL(querySql, "udinghuo");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });