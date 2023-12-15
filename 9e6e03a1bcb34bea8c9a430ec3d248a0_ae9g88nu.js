let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询开启委外放行gmp参数
    let paramSql = "select * from ISY_2.ISY_2.SY01_gmpparams where dr = 0 and isOutPass = 1 ";
    let paramRes = ObjectStore.queryByYonQL(paramSql);
    if (paramRes != null && paramRes.length > 0) {
      let paramOrgId = "(";
      for (let i = 0; i < paramRes.length; i++) {
        paramOrgId += paramRes[i].org_id + ",";
      }
      paramOrgId += "1 )";
      //根据开启委外放行gmp参数组织查询委外到货
      let osmArriveOrderSql = "select  id from po.arriveorder.OsmArriveOrder where tcOrgId.id in " + paramOrgId;
      let osmArriveOrder = ObjectStore.queryByYonQL(osmArriveOrderSql, "productionorder");
      let resultOrder = [];
      if (osmArriveOrder != null && osmArriveOrder.length > 0) {
        for (let i = 0; i < osmArriveOrder.length; i++) {
          //通过委外到货id查询放行单是否有审核中的单据
          let releaseOrderSql = "select  id from ISY_2.ISY_2.release_order where verifystate !='2' and relationId = '" + osmArriveOrder[i].id + "'";
          let releaseOrder = ObjectStore.queryByYonQL(releaseOrderSql);
          if (releaseOrder == null || releaseOrder.length == 0) {
            resultOrder.push(osmArriveOrder[i].id);
          }
        }
      }
      return { osmArriveOrder: resultOrder };
    }
  }
}
exports({ entryPoint: MyAPIHandler });