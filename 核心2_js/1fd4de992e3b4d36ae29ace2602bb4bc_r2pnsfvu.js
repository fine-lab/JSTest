let AbstractAPIHandler = require("AbstractAPIHandler");
class QueryFactoryAnnualHandler extends AbstractAPIHandler {
  execute(request) {
    let { orgid, yearly } = request;
    if (!orgid || !yearly) {
      return { annualPlans: [], isReformulate: "N" };
    }
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
      plan.salePrice = plan.confirmPrice_b;
      plan.saleNum = plan.confirmNum_b;
      plan.saleAmount = plan.confirmAmount_b;
      plan.internalPrice = plan.confirmPrice_b;
      plan.purchaseNum = plan.confirmNum_b;
      plan.purchaseAmount = plan.confirmAmount_b;
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
      "material.code as materialcode",
      "material.code",
      "material.name",
      "specs",
      "approvalUnit",
      "manufacturer",
      "saleMargin",
      "variableCost",
      "confirmPrice_b",
      "confirmNum_b",
      "confirmAmount_b",
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
    let orderPart = " order by purchaseOrg, material ";
    return queryPart + wherePart + orderPart;
  }
}
exports({ entryPoint: QueryFactoryAnnualHandler });