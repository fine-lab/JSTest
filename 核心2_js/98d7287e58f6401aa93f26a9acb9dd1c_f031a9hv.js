let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.data[0].orderno == undefined || param.data[0].orderno.length > 255) {
      param.data[0].set("orderno", "");
    }
    // 在线支付时默认结算方式为拉卡拉支付
    if (param.data[0].paytype === 1) {
      // 结算方式
      param.data[0].set("settlemode", "1679241434451935241");
      param.data[0].set("settlemode_code", "101210");
      param.data[0].set("settlemode_name", "易宝支付");
      // 交易类型默认
      param.data[0].set("tradetype", "2724337127051776");
      param.data[0].set("tradetype_code", "F2-Cxx-001");
      param.data[0].set("tradetype_name", "余额预收单");
      // 银行账户
      param.data[0].set("enterprisebankaccount", "2711700299519512");
      param.data[0].set("enterprisebankaccount_code", "122909484510802_49");
      param.data[0].set("enterprisebankaccount_name", "肆拾玖坊（天津）贸易有限公司");
    }
  }
}
exports({ entryPoint: MyTrigger });