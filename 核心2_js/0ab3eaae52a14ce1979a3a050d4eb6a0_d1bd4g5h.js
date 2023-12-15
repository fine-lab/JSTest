let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.data.merchantId;
    // 期初返利金额
    var querySaleSql = "select id FROM voucher.rebate.RebateShareSetting where name='期初余额'";
    var resultSales = ObjectStore.queryByYonQL(querySaleSql, "marketingbill");
    var shareSettingId = resultSales[0].id;
    querySaleSql =
      "select code,rebateStatus,auditDate,auditTime,rebateMoney FROM voucher.rebate.Rebate where agentId='" + id + "' and shareSettingId='" + shareSettingId + "' and rebateStatus = 'ENDCONFIRM'";
    resultSales = ObjectStore.queryByYonQL(querySaleSql, "marketingbill");
    return { resultSales };
  }
}
exports({ entryPoint: MyAPIHandler });