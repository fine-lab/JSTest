let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var server = extrequire("GT15312AT4.tool.getServer").execute();
    let header = extrequire("GT15312AT4.tool.getApiHeader").execute();
    // 获取值
    var accountId = request.accountId;
    var startTime = request.startBill;
    var entTime = request.endBill;
    var showZeroCharge = request.showZeroCharge;
    var requestUrl =
      server.url +
      "/api/app-cmp-console/billinstance/month/syncBillingCycles?billingCycles=" +
      startTime +
      "&billingCycles=" +
      entTime +
      "&accountId=" +
      accountId +
      "&showZeroCharge=" +
      showZeroCharge;
    var strResponse = postman("POST", requestUrl, JSON.stringify(header), "{}");
    var responseObj = JSON.parse(strResponse);
    return responseObj;
  }
}
exports({ entryPoint: MyAPIHandler });