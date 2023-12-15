let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取实收对象
    var receivableB = param.data[0];
    var aa = JSON.stringify(param.requestData);
    if (receivableB.type_of_document === "普通") {
      var receivable = ObjectStore.selectById("GT43955AT9.GT43955AT9.account_receivable", { id: receivableB.source_id });
      receivable.billing_status = "欠缴";
      var testUpdataList = ObjectStore.updateById("GT43955AT9.GT43955AT9.account_receivable", receivable, "4c20c229");
    }
    // 获取应收ID
    return {};
  }
}
exports({ entryPoint: MyTrigger });