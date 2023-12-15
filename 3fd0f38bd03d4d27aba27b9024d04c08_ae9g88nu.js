let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询开启采购到货放行gmp参数
    let paramSql = "select * from ISY_2.ISY_2.SY01_gmpparams where dr = 0 and isMaterialPass = 1 ";
    let paramRes = ObjectStore.queryByYonQL(paramSql);
    if (paramRes != null && paramRes.length > 0) {
      let paramOrgId = "(";
      for (let i = 0; i < paramRes.length; i++) {
        paramOrgId += paramRes[i].org_id + ",";
      }
      paramOrgId += "1 )";
      //根据开启采购到货放行gmp参数组织查询完工报告
      let arrivalOrderSql = "select  id from 	pu.arrivalorder.ArrivalOrder where inInvoiceOrg.id in " + paramOrgId;
      let arrivalOrder = ObjectStore.queryByYonQL(arrivalOrderSql, "upu");
      let resultOrder = [];
      if (arrivalOrder != null && arrivalOrder.length > 0) {
        for (let i = 0; i < arrivalOrder.length; i++) {
          //通过采购到货id查询放行单是否有审核中的单据
          let releaseOrderSql = "select  id from ISY_2.ISY_2.release_order where verifystate !='2' and relationId = '" + arrivalOrder[i].id + "'";
          let releaseOrder = ObjectStore.queryByYonQL(releaseOrderSql);
          if (releaseOrder == null || releaseOrder.length == 0) {
            resultOrder.push(arrivalOrder[i].id);
          }
        }
      }
      return { arrivalOrder: resultOrder };
    }
  }
}
exports({ entryPoint: MyAPIHandler });