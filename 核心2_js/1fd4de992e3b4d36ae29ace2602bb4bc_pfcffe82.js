let AbstractAPIHandler = require("AbstractAPIHandler");
class QueryFactoryAnnualHandler extends AbstractAPIHandler {
  execute(request) {
    let { orgid, yearly } = request;
    let sql = this.getQuerySql(orgid, yearly);
    let annualPlans = ObjectStore.queryByYonQL(sql);
    if (!annualPlans || annualPlans.length <= 0) {
      return { annualPlans: [] };
    }
    // 过滤已经被工业保存的
    annualPlans = this.filterFactorySaved(annualPlans);
    if (!annualPlans || annualPlans.length <= 0) {
      return { annualPlans: [] };
    }
    // 过滤商业未审批的
    let purchaseBills = this.getPurchaseBills(annualPlans);
    if (!purchaseBills || purchaseBills.length <= 0) {
      return { annualPlans: [] };
    }
    let bills = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_businessplan", { ids: purchaseBills });
    let billstatusMap = new Map();
    for (let bill of bills) {
      billstatusMap.set(bill.id, bill.verifystate);
    }
    annualPlans = annualPlans.filter(function (plan) {
      return billstatusMap.get(plan.purchaseBill) === 2;
    });
    return { annualPlans: annualPlans };
  }
  filterFactorySaved(annualPlans) {
    if (!annualPlans || annualPlans.length <= 0) {
      return null;
    }
    // 商业已保存&&工业未保存
    annualPlans = annualPlans.filter(function (plan) {
      return plan.purchaseBill && plan.purchaseSave === "Y" && !plan.factoryBill && plan.factorySave !== "Y";
    });
    return annualPlans;
  }
  getPurchaseBills(annualPlans) {
    if (!annualPlans || annualPlans.length <= 0) {
      return null;
    }
    let purchaseSet = new Set();
    annualPlans.forEach(function (plan) {
      purchaseSet.add(plan.purchaseBill);
    });
    return Array.from(purchaseSet);
  }
  getQuerySql(orgid, yearly) {
    let fields = [
      "id as sourcePlan",
      "purchaseOrg",
      "purchaseOrg.name",
      "material",
      "material.name",
      "specs",
      "approvalUnit",
      "manufacturer",
      "saleNum",
      "salePrice",
      "saleAmount",
      "saleMargin",
      "confirmDate",
      "confirmRatio",
      "monthlyRatio",
      "planVersion",
      "lastPlan",
      "purchaseBill",
      "purchaseSave",
      "factoryBill",
      "factorySave"
    ]; //
    let queryPart = "select " + fields.join(", ") + " from GT7139AT4.GT7139AT4.sy_annualplan";
    let wherePart = " where dr = 0 and isLasted = 'Y' and factoryOrg = " + orgid + " and yearly = '" + yearly + "' ";
    return queryPart + wherePart;
  }
}
exports({ entryPoint: QueryFactoryAnnualHandler });