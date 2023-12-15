let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var field = request.field;
    var param = request.param;
    var domain = request.domain; // sact 或 udinghuo
    var tbName = request.tbName; // sact.contract.SalesContract 或 voucher.invoice.SaleInvoice
    param = param == undefined ? "" : param;
    field = field == undefined ? "*" : field;
    var yonql = "select " + field + " from " + tbName + param + " limit 100";
    var res = ObjectStore.queryByYonQL(yonql, domain);
    return { response: res };
  }
}
exports({ entryPoint: MyAPIHandler });