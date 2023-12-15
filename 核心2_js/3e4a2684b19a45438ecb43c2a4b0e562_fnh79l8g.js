let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var backmny = param.data[0].backmny;
    var can_refund_the_deposit = param.data[0].can_refund_the_deposit;
    if (can_refund_the_deposit - backmny < 0) {
      throw new Error("本次使用押金不能大于可退押金！");
    } else {
      //获取押金台账
      var depositList = ObjectStore.selectByMap("GT48750AT21.GT48750AT21.deposit_parameter4", { code: param.data[0].deposit_code });
      var yszdhc = new Object();
      yszdhc = depositList[0];
      yszdhc.state = "2";
      ObjectStore.updateById("GT48750AT21.GT48750AT21.deposit_parameter4", yszdhc, "cde4662c");
    }
    return { param };
  }
}
exports({ entryPoint: MyTrigger });