let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var quotationid = uuid();
    var name = request.name;
    var userid = request.userid;
    var quotation_time = request.quotation_time;
    var amount_of_money = request.amount_of_money;
    var details = request.details;
    var purchase_period = request.purchase_period;
    var service_fee = request.service_fee;
    if (userid == null) {
      throw new Error("用户id(userid)不允许为空！");
    }
    if (quotation_time == null) {
      throw new Error("报价时间(quotation_time)不允许为空！");
    }
    if (amount_of_money == null) {
      throw new Error("报价金额(amount_of_money)不允许为空！");
    }
    if (details == null) {
      throw new Error("报价详情(details)不允许为空！");
    }
    if (purchase_period == null) {
      throw new Error("购买年限(purchase_period)不允许为空！");
    }
    if (service_fee == null) {
      throw new Error("实施费用(service_fee)不允许为空！");
    }
    //同步年、年月、年月日
    var yy = substring(quotation_time, 0, 4);
    var yyMM = substring(quotation_time, 0, 7);
    var yyMMdd = substring(quotation_time, 0, 10);
    var quoteLogObj = {
      quo_yy: yy,
      quo_yyMM: yyMM,
      quo_yyMMdd: yyMMdd,
      share_times: 0,
      quotationid: quotationid,
      name: name,
      userid: userid,
      quotation_time: quotation_time,
      amount_of_money: amount_of_money,
      def1: purchase_period,
      def2: service_fee,
      service_fee: service_fee,
      details: details
    };
    var res = ObjectStore.insert("GT6990AT161.GT6990AT161.cs_quo_log", quoteLogObj, "f1e11e9e");
    return { result: res };
  }
}
exports({ entryPoint: MyAPIHandler });