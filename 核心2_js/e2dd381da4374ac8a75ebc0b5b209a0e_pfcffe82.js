let AbstractAPIHandler = require("AbstractAPIHandler");
class QueryFactoryMonthlyHandler extends AbstractAPIHandler {
  execute(request) {
    let { orgid, yearly, monthly } = request;
    // 获取存在的月度订单
    let sql = this.getMonthlySql(orgid, yearly, monthly);
    let monthlyPlans = ObjectStore.queryByYonQL(sql);
    if (!monthlyPlans || monthlyPlans.length <= 0) {
      return { monthlyPlans: [] };
    }
    // 过滤商业未审批的
    let purchaseBills = this.getPurchaseBills(monthlyPlans);
    if (!purchaseBills || purchaseBills.length <= 0) {
      return { monthlyPlans: [] };
    }
    let bills = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_businessorder", { ids: purchaseBills });
    let billstatusMap = new Map();
    for (let bill of bills) {
      billstatusMap.set(bill.id, bill.verifystate);
    }
    monthlyPlans = monthlyPlans.filter(function (plan) {
      return billstatusMap.get(plan.purchaseBill) === 2;
    });
    // 过滤已经被工业保存的
    monthlyPlans = this.filterFactorySaved(monthlyPlans);
    if (!monthlyPlans || monthlyPlans.length <= 0) {
      return { monthlyPlans: [] };
    }
    return { monthlyPlans: monthlyPlans };
  }
  filterFactorySaved(monthlyPlans) {
    if (!monthlyPlans || monthlyPlans.length <= 0) {
      return null;
    }
    monthlyPlans = monthlyPlans.filter(function (plan) {
      return !plan.factoryBill && plan.factorySave !== "Y";
    });
    return monthlyPlans;
  }
  getPurchaseBills(monthlyPlans) {
    if (!monthlyPlans || monthlyPlans.length <= 0) {
      return null;
    }
    let purchaseSet = new Set();
    monthlyPlans.forEach(function (plan) {
      purchaseSet.add(plan.purchaseBill);
    });
    return Array.from(purchaseSet);
  }
  getMonthlySql(orgid, yearly, monthly) {
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
      "variableCost",
      "saleMargin",
      "internalPrice",
      "purchaseNum",
      "purchaseAmount",
      "nextMonthNum",
      "nextMonthAmount",
      "manxNum",
      "manxAmount",
      "purchaseBill",
      "factoryBill"
    ];
    let queryPart = "select " + fields.join(", ") + " from GT7139AT4.GT7139AT4.sy_monthlyplans";
    let wherePart = " where dr = 0 and enable = 1 and isLasted = 'Y' and factoryOrg = " + orgid + " and yearly = '" + yearly + "' and monthly = " + monthly;
    return queryPart + wherePart;
  }
}
exports({ entryPoint: QueryFactoryMonthlyHandler });