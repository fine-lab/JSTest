let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.data[0].orderno == undefined || param.data[0].orderno.length > 255) {
      param.data[0].set("orderno", "");
    }
    // 在线支付时默认结算方式为拉卡拉支付
    if (param.data[0].paytype + "" == "1") {
      // 结算方式
      // 结算方式
      param.data[0].set("settlemode", "1679242946280423433");
      param.data[0].set("settlemode_code", "101210");
      param.data[0].set("settlemode_name", "易宝支付");
      // 交易类型默认
      param.data[0].set("tradetype", "2714651802686208");
      param.data[0].set("tradetype_code", "F2-Cxx-001");
      param.data[0].set("tradetype_name", "余额预收单");
    }
  }
}
exports({ entryPoint: MyTrigger });