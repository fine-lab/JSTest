let AbstractAPIHandler = require("AbstractAPIHandler");
class QueryPurchaseMonthlyHandler extends AbstractAPIHandler {
  execute(request) {
    let { orgid, yearly, monthly } = request;
    // 取年度计划，如果没有年度计划则无法继续月度订单
    let annualSql = this.getAnnualSql(orgid, yearly);
    let annualPlans = ObjectStore.queryByYonQL(annualSql);
    if (!annualPlans || annualPlans.length <= 0) {
      return { monthlyPlans: [] };
    }
    // 年度计划需要是被商业公司和工业公司审批通过的
    let { purchaseBill, factoryBill } = this.getAnnualApproveBills(annualPlans) || {};
    if (!purchaseBill || purchaseBill.length <= 0 || !factoryBill || factoryBill.length <= 0) {
      return { monthlyPlans: [] };
    }
    let purbills = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_businessplan", { ids: purchaseBill });
    let factbills = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_factoryplan", { ids: factoryBill });
    let billstatusMap = new Map();
    for (let bill of purbills) {
      billstatusMap.set("p" + bill.id, bill.verifystate);
    }
    for (let bill of factbills) {
      billstatusMap.set("f" + bill.id, bill.verifystate);
    }
    annualPlans = annualPlans.filter(function (plan) {
      return (
        plan.purchaseBill &&
        plan.purchaseSave === "Y" &&
        plan.factoryBill &&
        plan.factorySave === "Y" &&
        billstatusMap.get("p" + plan.purchaseBill) === 2 &&
        billstatusMap.get("f" + plan.factoryBill) === 2
      );
    });
    // 如果年度计划未审批，查询上一版计划
    if (!annualPlans || annualPlans.length <= 0) {
      let lastPlans = this.getLastAnnualPlans(annualPlans);
      if (lastPlans && lastPlans.length > 0) {
        annualPlans = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_annualplan", { ids: lastPlans });
      }
    }
    if (!annualPlans || annualPlans.length <= 0) {
      return { monthlyPlans: [] };
    }
    // 查询是最新版月度计划
    let monthlySql = this.getMonthlySql(orgid, yearly, monthly);
    let monthlyPlans = ObjectStore.queryByYonQL(monthlySql);
    if (monthlyPlans && monthlyPlans.length > 0) {
      // 修订月度计划要求此纪录已经被工业审批, 或者是新版年度计划增补的
      let factoryBills = this.getFactoryBills(monthlyPlans);
      if (!factoryBills || factoryBills.length <= 0) {
        return { monthlyPlans: [] };
      }
      let bills = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_factoryorders", factoryBills);
      let billstatusMap = new Map();
      for (let bill of bills) {
        billstatusMap.set(bill.id, bill.verifystate);
      }
      monthlyPlans = monthlyPlans.filter(function (plan) {
        return !plan.factoryBill || billstatusMap.get(plan.factoryBill) === 2;
      });
      // 合并新年度计划增补的记录
      let annualAdditional = this.getAnnualAdditional(monthlyPlans, annualPlans);
      monthlyPlans = monthlyPlans.concat(annualAdditional);
      return { monthlyPlans: monthlyPlans };
    } else {
      // 根据年度计划的每月分摊比例重新计算月度计划的数量和金额
      monthlyPlans = this.initMonthlyPlans(annualPlans, monthly);
    }
    return { monthlyPlans: monthlyPlans };
  }
  getAnnualAdditional(monthlyPlans, annualPlans) {
    if (!annualPlans || annualPlans.length <= 0) {
      return [];
    }
    let needsupplement = [];
    let monthlyMap = new Map();
    for (let plan of monthlyPlans) {
      let key = [plan.factoryOrg, plan.material].join("");
      monthlyMap.set(key, plan);
    }
    for (let plan of annualPlans) {
      let key = [plan.factoryOrg, plan.material].join("");
      let monthly = monthlyMap.get(key);
      if (!monthly) {
        let newMonthlyPlan = this.calcMonthlyByAnnual(plan);
        needsupplement.push(newMonthlyPlan);
      }
    }
    return needsupplement;
  }
  calcMonthlyByAnnual(annualPlan) {
    annualPlan.purchaseNum = annualPlan.purchaseNum * annualPlan.monthlyRatio;
    annualPlan.purchaseAmount = annualPlan.purchaseNum * annualPlan.internalPrice;
    annualPlan.saleNum = annualPlan.saleNum * annualPlan.monthlyRatio;
    annualPlan.saleAmount = annualPlan.saleNum * annualPlan.salePrice;
    // 计算下月和下下月，此处算法后续更新
    annualPlan.nextMonthNum = annualPlan.purchaseNum;
    annualPlan.nextMonthAmount = annualPlan.purchaseAmount;
    annualPlan.manxNum = annualPlan.purchaseNum;
    annualPlan.manxAmount = annualPlan.purchaseAmount;
    annualPlan.purchaseBill = null;
    annualPlan.factoryBill = null;
    return annualPlan;
  }
  initMonthlyPlans(annualPlans, monthly) {
    if (!annualPlans || annualPlans.length <= 0) {
      return null;
    }
    for (let plan of annualPlans) {
      this.calcMonthlyByAnnual(plan);
    }
    return annualPlans;
  }
  getLastAnnualPlans(annualPlans) {
    if (!annualPlans || annualPlans.length <= 0) {
      return null;
    }
    let lastPlans = [];
    for (let plan of annualPlans) {
      if (plan.lastPlan) {
        lastPlans.push(plan.lastPlan);
      }
    }
    return lastPlans;
  }
  getAnnualApproveBills(annualPlans) {
    if (!annualPlans || annualPlans.length <= 0) {
      return null;
    }
    let purchaseSet = new Set();
    let factorySet = new Set();
    for (let plan of annualPlans) {
      if (plan.purchaseBill) {
        purchaseSet.add(plan.purchaseBill);
      }
      if (plan.factoryBill) {
        factorySet.add(plan.factoryBill);
      }
    }
    return { purchaseBill: Array.from(purchaseSet), factoryBill: Array.from(factorySet) };
  }
  getFactoryBills(monthlyPlans) {
    if (!monthlyPlans || monthlyPlans.length <= 0) {
      return null;
    }
    let factorySet = new Set();
    for (let plan of monthlyPlans) {
      if (plan.factoryBill && plan.factorySave === "Y") {
        factorySet.add(plan.factoryBill);
      }
    }
    return Array.from(factorySet);
  }
  getAnnualSql(orgid, yearly) {
    let fields = [
      "id as sourceAnnualPlan",
      "factoryOrg",
      "factoryOrg.name",
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
      "confirmDate",
      "confirmRatio",
      "monthlyRatio",
      "purchaseBill",
      "purchaseSave",
      "factoryBill",
      "factorySave",
      "planVersion",
      "lastPlan",
      "plansourcetype"
    ];
    let queryPart = "select " + fields.join(", ") + " from GT7139AT4.GT7139AT4.sy_annualplan";
    let wherePart = " where dr = 0 and enable = 1 and isLasted = 'Y' and purchaseOrg = " + orgid + " and yearly = '" + yearly + "' ";
    return queryPart + wherePart;
  }
  getMonthlySql(orgid, yearly, monthly) {
    let fields = [
      "id as sourcePlan",
      "sourceAnnualPlan",
      "factoryOrg",
      "factoryOrg.name",
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
      "purchaseSave",
      "factoryBill",
      "factorySave"
    ];
    let queryPart = "select " + fields.join(", ") + " from GT7139AT4.GT7139AT4.sy_monthlyplans";
    let wherePart = " where dr = 0 and enable = 1 and isLasted = 'Y' and purchaseOrg = " + orgid + " and yearly = '" + yearly + "' and monthly = " + monthly;
    return queryPart + wherePart;
  }
}
exports({ entryPoint: QueryPurchaseMonthlyHandler });