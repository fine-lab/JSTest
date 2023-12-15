let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取实收对象
    var receivableB = param.data[0];
    var paid_in_amount_y = receivableB.bill_of_paymentList[0].paid_in_amount_y;
    var accounts_receivable_amount_y = receivableB.bill_of_paymentList[0].accounts_receivable_amount_y;
    if (paid_in_amount_y > accounts_receivable_amount_y) {
      throw new Error("实收金额(含税)不能大于应收金额(含税)！");
    }
    // 获取应收ID
    var receivableId = receivableB.accounts_receivable_id;
    var receivable = ObjectStore.selectById("GT43955AT9.GT43955AT9.account_receivable", { id: receivableId });
    //修改应收状态为"锁定"
    receivable.billing_status = "锁定";
    var testUpdataList = ObjectStore.updateById("GT43955AT9.GT43955AT9.account_receivable", receivable, "4c20c229");
    return { testMessage: testUpdataList };
  }
}
exports({ entryPoint: MyTrigger });