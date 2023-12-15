let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.data.merchantId;
    // 期初返利金额
    var querySaleSql =
      "select code,rebateStatus,auditDate,auditTime,rebateMoney FROM voucher.rebate.Rebate where agentId='" + id + "' and rebateStatus = 'ENDCONFIRM' order by auditDate desc, code desc limit 0,1";
    var resultSales = ObjectStore.queryByYonQL(querySaleSql, "marketingbill");
    return { resultSales };
  }
}
exports({ entryPoint: MyAPIHandler });