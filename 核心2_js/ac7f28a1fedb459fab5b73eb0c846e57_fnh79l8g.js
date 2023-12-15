let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取收款调整单对象
    var receivableB = param.data[0];
    var paid_in_after_adjustment_y = receivableB.payment_adjustment_listList[0].paid_in_after_adjustment_y;
    var paid_in_before_adjustment_y = receivableB.payment_adjustment_listList[0].paid_in_before_adjustment_y;
    if (paid_in_after_adjustment_y > paid_in_before_adjustment_y) {
      throw new Error("调整后实收含税不能大于调整前实收含税！");
    }
    // 获取收款单ID
    var voucherId = receivableB.voucher_id;
    var voucher = ObjectStore.selectById("GT45627AT16.GT45627AT16.voucher", { id: voucherId });
    //修改应收状态为"锁定"
    voucher.billing_status = "锁定";
    var testUpdataList = ObjectStore.updateById("GT45627AT16.GT45627AT16.voucher", voucher, "44cfebd6");
    return { testMessage: testUpdataList };
  }
}
exports({ entryPoint: MyTrigger });