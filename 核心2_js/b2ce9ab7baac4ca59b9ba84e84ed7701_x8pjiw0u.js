let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let wuliaoId = "yourIdHere";
    let chengbenyuId = "";
    let picihao = "202311010006";
    //入库还是出库：inorout，成本域：costreg，批次号：batchcode，物料ID：material，数量：num，单价：price，金额：money，
    var sql = "select * from ia.account.IADetailLedgerVO where batchcode = '" + picihao + "'  and material = '" + wuliaoId + "' order by createTime";
    var res = ObjectStore.queryByYonQL(sql, "yonyoufi");
    throw new Error("======" + JSON.stringify(res));
    return { res };
  }
}
exports({ entryPoint: MyTrigger });