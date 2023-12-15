let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let selFinanceOrgRes = [];
    let orgId = [];
    //查询工厂组织
    let selFactoryOrgSql = "select * from org.func.FactoryOrg";
    let selFactoryOrgRes = ObjectStore.queryByYonQL(selFactoryOrgSql, "ucf-org-center");
    if (selFactoryOrgRes.length > 0) {
      for (let i = 0; i < selFactoryOrgRes.length; i++) {
        orgId.push(selFactoryOrgRes[i].orgid);
      }
    }
    //查询库存组织
    let selInventoryOrgSql = "select * from org.func.InventoryOrg";
    let selInventoryOrgRes = ObjectStore.queryByYonQL(selInventoryOrgSql, "ucf-org-center");
    if (selInventoryOrgRes.length > 0) {
      for (let i = 0; i < selFactoryOrgRes.length; i++) {
        orgId.push(selFactoryOrgRes[i].orgid);
      }
    }
    //查询会计主体
    let selFinanceOrgSql = "select * from org.func.BaseOrg";
    selFinanceOrgRes = ObjectStore.queryByYonQL(selFinanceOrgSql, "ucf-org-center");
    if (selFinanceOrgRes.length > 0) {
      for (let i = 0; i < selFactoryOrgRes.length; i++) {
        orgId.push(selFactoryOrgRes[i].orgid);
      }
    }
    return { orgId };
  }
}
exports({ entryPoint: MyAPIHandler });