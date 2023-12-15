let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sourceId = request.sourceMId;
    //查询购进入库验收单主表
    let masterSql = "select id from GT22176AT10.GT22176AT10.SY01_purinstockysv2 where source_id=" + sourceId;
    let masterRes = ObjectStore.queryByYonQL(masterSql, "sy01");
    let ids = [];
    if (masterRes.length > 0) {
      for (let i = 0; i < masterRes.length; i++) {
        ids.push(masterRes[i].id);
      }
    }
    let str_ids = ids.join(",");
    //查询购进入库验收单子表
    let childSql = "select * from GT22176AT10.GT22176AT10.SY01_purinstockys_l where SY01_purinstockysv2_id in (" + str_ids + ")";
    let childRes = ObjectStore.queryByYonQL(childSql, "sy01");
    let arrivalChildIds = [];
    let arrivalCheckQty = {};
    if (masterRes.length > 0) {
      for (let i = 0; i < masterRes.length; i++) {
        arrivalChildIds.push(masterRes[i].sourcechild_id);
        arrivalCheckQty[masterRes[i].sourcechild_id] += masterRes[i].qualifie_qty;
        arrivalCheckQty[masterRes[i].sourcechild_id] += masterRes[i].unqualifie_qty;
      }
    }
    let str_arrivalChildIds = arrivalChildIds.join(",");
    //查询到货单子表信息
    let arrivalChildSql = "select * from pu.arrivalorder.ArrivalOrders where id in (" + str_arrivalChildIds + ")";
    let arrivalChildRes = ObjectStore.queryByYonQL(arrivalChildSql, "upu");
    let checkTotleQty = {};
    if (arrivalChildRes.length > 0) {
      for (let i = 0; i < arrivalChildRes.length; i++) {
        checkTotleQty[arrivalCheckQty[arrivalChildRes[i].id]] = parseInt(arrivalChildRes[id].qty - arrivalCheckQty[masterRes[i].sourcechild_id]);
      }
    }
    return { checkTotleQty };
  }
}
exports({ entryPoint: MyAPIHandler });