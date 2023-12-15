let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let bill = param.data[0];
    //其他出库单判断
    let othoutrecordcode = bill.othoutrecordcode;
    if (!queryUtils.isEmpty(othoutrecordcode) && othoutrecordcode != "--") {
      throw new Error("请先删除下游的其他出库单:" + othoutrecordcode);
    }
    let sql = "select id,id.code as code from st.othoutrecord.OthOutRecordCustomItem" + " where define58=" + bill["id"] + " and define60='developplatform.57e2f30a'";
    let res = ObjectStore.queryByYonQL(sql, "ustock");
    if (!queryUtils.isEmpty(res)) {
      throw new Error("请先删除下游的其他出库单:" + res[0]["code"]);
    }
    // 库存状态调整单
    let stockstatuschangecode = bill.stockstatuschangecode;
    let sql1 = "select id,id.code as code from st.goodchange.GoodChangeCustomItem" + " where define58=" + bill["id"] + " and define60='developplatform.57e2f30a'";
    let res1 = ObjectStore.queryByYonQL(sql, "ustock");
    return {};
  }
}
exports({ entryPoint: MyTrigger });