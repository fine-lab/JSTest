let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let chengbenyuId = request.chengbenyuId;
    let wuliaoId = request.wuliaoId;
    let picihao = request.picihao;
    //入库还是出库：inorout，成本域：costreg，批次号：batchcode，物料ID：material，数量：num，单价：price，金额：money，
    var sql = "select * from ia.account.IADetailLedgerVO where costreg = '" + chengbenyuId + "' and material = '" + wuliaoId + "' and batchcode = '" + picihao + "' order by createTime";
    var res = ObjectStore.queryByYonQL(sql, "yonyoufi");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });