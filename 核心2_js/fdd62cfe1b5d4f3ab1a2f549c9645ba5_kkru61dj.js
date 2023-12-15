let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let selFinanceOrgRes = [];
    let apiPreAndAppListCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //获取完工报告单详细信息
    let finishedDetailUrl = apiPreAndAppListCode.apiPrefix + "/yonbip/mfg/finishedreport/detail?id=" + request.finishedId;
    let finishedDetailRes = openLinker("GET", finishedDetailUrl, "ISY_2", null);
    finishedDetailRes = JSON.parse(finishedDetailRes);
    let finishedDetailData = finishedDetailRes.data;
    //查询工厂组织
    let selFactoryOrgSql = "select * from org.func.FactoryOrg where id = '" + request.orgId + "'";
    let selFactoryOrgRes = ObjectStore.queryByYonQL(selFactoryOrgSql, "ucf-org-center");
    //通过工厂组织ID查询库存组织
    let selInventoryOrgSql = "select * from org.func.InventoryOrg where orgid = " + selFactoryOrgRes[0].orgid;
    let selInventoryOrgRes = ObjectStore.queryByYonQL(selInventoryOrgSql, "ucf-org-center");
    if (selInventoryOrgRes.length > 0) {
      //通过库存组织的关联会计主体ID查询组织单元
      let selFinanceOrgSql = "select * from org.func.BaseOrg where id = '" + selInventoryOrgRes[0].finorgid + "'";
      selFinanceOrgRes = ObjectStore.queryByYonQL(selFinanceOrgSql, "ucf-org-center");
      selFinanceOrgRes[0].finishedReportDetail = finishedDetailData;
      return { selFinanceOrgRes };
    } else {
      selFinanceOrgRes[0].finishedReportDetail = finishedDetailData;
      return { selFinanceOrgRes };
    }
  }
}
exports({ entryPoint: MyAPIHandler });