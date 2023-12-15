let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let batchNo = request.batchNo;
    let prodCode = request.prodCode;
    //查询入库验收子表数据
    const inStockTestSubSql =
      "select id, SY01_purinstockysv2_id,enclosure from GT22176AT10.GT22176AT10.SY01_purinstockys_l where dr = 0 and material = '" + prodCode + "' and  batch_no = '" + batchNo + "'";
    let inStockTestSubReses = ObjectStore.queryByYonQL(inStockTestSubSql);
    var inStockTestReses;
    if (inStockTestSubReses.length > 0) {
      var inCondition = "";
      for (let inStockTestSubRes of inStockTestSubReses) {
        inCondition = inCondition + inStockTestSubRes.SY01_purinstockysv2_id + ",";
      }
      inCondition = inCondition.substring(0, inCondition.length - 1);
      const inStockTestSql = "select id,code from GT22176AT10.GT22176AT10.SY01_purinstockysv2 where dr = 0 and id in(" + inCondition + ")";
      inStockTestReses = ObjectStore.queryByYonQL(inStockTestSql);
    }
    return { mainRes: inStockTestReses, subRes: inStockTestSubReses };
  }
}
exports({ entryPoint: MyAPIHandler });