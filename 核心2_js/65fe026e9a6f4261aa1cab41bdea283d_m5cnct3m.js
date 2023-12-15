let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //存货核算的结算结账单
    var sql = "select accbooktype,accbody,period,periodid,settle_flag,account_flag,closeaccount_flag from ia.settleaccount.IASettleAccountVO";
    var nameObj = ObjectStore.queryByYonQL(sql, "yonyoufi");
    // 存货核算的存货明细账
    throw new Error(JSON.stringify(nameObj));
    return {};
  }
}
exports({ entryPoint: MyTrigger });