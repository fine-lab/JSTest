let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var proid = request.proid;
    var agentId = request.agentId;
    //查询销售订单订单状态不为“开立”、“审批中”
    let querySql =
      "select oriTaxUnitPrice from voucher.invoice.SaleInvoiceDetail where mainid in (select id from voucher.invoice.SaleInvoice where agentId=" +
      agentId +
      " and status='1'  order by vouchdate desc ) and productId=" +
      proid +
      "  order by pubts desc";
    var res = ObjectStore.queryByYonQL(querySql, "udinghuo");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });