let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取应收调整单对象
    var receivableB = param.data[0];
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