let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    const { data } = param;
    if (!Array.isArray(data) || data.length === 0) {
      return param;
    }
    const billData = data[0];
    //实体查询
    const res = ObjectStore.selectById("st.transferapply.TransferApply", { id: billData.id });
    if (!res || !res.memo || !res.memo.startsWith("SL_")) {
      return param;
    }
    throw new Error(" MES推出的调拨订单，不允许手工删除");
  }
}
exports({ entryPoint: MyTrigger });