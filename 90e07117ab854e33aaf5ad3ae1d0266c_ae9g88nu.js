let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询开启完工放行gmp参数
    let paramSql = "select * from ISY_2.ISY_2.SY01_gmpparams where dr = 0 and isProductPass = 1 ";
    let paramRes = ObjectStore.queryByYonQL(paramSql);
    if (paramRes != null && paramRes.length > 0) {
      let paramOrgId = "(";
      for (let i = 0; i < paramRes.length; i++) {
        paramOrgId += paramRes[i].org_id + ",";
      }
      paramOrgId += "1 )";
      //根据开启完工放行gmp参数组织查询完工报告
      let finishedReportSql = "select  id,orgId.id   from po.finishedreport.FinishedReport";
      let finishedReport = ObjectStore.queryByYonQL(finishedReportSql, "productionorder");
      let resultOrder = [];
      if (finishedReport != null && finishedReport.length > 0) {
        for (let i = 0; i < finishedReport.length; i++) {
          let selInventoryOrgSql = "select * from org.func.InventoryOrg where orgid = " + finishedReport[i].orgId;
          let selInventoryOrgRes = ObjectStore.queryByYonQL(selInventoryOrgSql, "ucf-org-center");
          if (selInventoryOrgRes != null && selInventoryOrgRes.length > 0) {
            //通过库存组织的关联会计主体ID查询组织单元
            let selFinanceOrgSql = "select * from org.func.BaseOrg where id = '" + selInventoryOrgRes[0].finorgid + "'";
            let selFinanceOrgRes = ObjectStore.queryByYonQL(selFinanceOrgSql, "ucf-org-center");
            if (selFinanceOrgRes != null && selFinanceOrgRes.length > 0) {
              if (paramOrgId.indexOf(selFinanceOrgRes[0].id) > -1 || paramOrgId.indexOf(finishedReport[i].orgId) > -1) {
                //判断会计主体和工厂组织是否开启gmp参数完工放行
                //通过完工报告id查询放行单是否有审核中的单据
                let releaseOrderSql = "select  id from ISY_2.ISY_2.release_order where verifystate !='2' and relationId = '" + finishedReport[i].id + "'";
                let releaseOrder = ObjectStore.queryByYonQL(releaseOrderSql);
                if (releaseOrder == null || releaseOrder.length == 0) {
                  resultOrder.push(finishedReport[i].id);
                }
              }
            }
          }
        }
      }
      return { finishedReport: resultOrder };
    }
  }
}
exports({ entryPoint: MyAPIHandler });