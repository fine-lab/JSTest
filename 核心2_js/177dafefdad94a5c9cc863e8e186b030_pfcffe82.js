let AbstractAPIHandler = require("AbstractAPIHandler");
class QueryPurchaseAnnualHandler extends AbstractAPIHandler {
  execute(request) {
    let { orgid, yearly } = request;
    let sql = this.getQuerySql(orgid, yearly);
    let lastPlans = ObjectStore.queryByYonQL(sql);
    if (!lastPlans || lastPlans.length <= 0) {
      return { annualPlans: [], isReformulate: "N" };
    }
    // 商业审批的行只有两种来源：
    // 上述两种来源整单互斥，同一张审批单不会既有来源于1的明细行，又有来源于2的明细行
    // 且如果来源为1，则查询到的计划必定都是预算
    let annualPlans = [],
      annualBudgets = [];
    for (let plan of lastPlans) {
      if (!plan.purchaseBill && !plan.factoryBill) {
        annualBudgets.push(plan);
      } else if (plan.purchaseBill) {
        annualPlans.push(plan);
      }
    }
    if (annualBudgets.length > 0) {
      annualBudgets.forEach(function (budget) {
        budget.isCopyed = "Y";
      });
      return { annualPlans: annualBudgets, isReformulate: "N" };
    }
    // 修订上一版计划要求计划记录是被商业和工业都审批通过的
    let billstatusMap = new Map();
    let { purchaseBill, factoryBill } = this.getAnnualApproveBills(annualPlans) || {};
    if (purchaseBill && purchaseBill.length > 0) {
      let purbills = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_businessplan", { ids: purchaseBill });
      for (let bill of purbills) {
        billstatusMap.set("p" + bill.id, bill.verifystate);
      }
    }
    if (factoryBill && factoryBill.length > 0) {
      let factbills = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_factoryplan", { ids: factoryBill });
      for (let bill of factbills) {
        billstatusMap.set("f" + bill.id, bill.verifystate);
      }
    }
    annualPlans = annualPlans.filter(function (plan) {
      plan.isCopyed = "N";
      return billstatusMap.get("p" + plan.purchaseBill) === 2 && billstatusMap.get("f" + plan.factoryBill) === 2;
    });
    return { annualPlans: annualPlans, isReformulate: "Y" };
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
  getQuerySql(orgid, yearly, isBudget) {
    let fields = [
      "id as sourcePlan",
      "factoryOrg",
      "factoryOrg.name",
      "material",
      "material.name",
      "specs",
      "approvalUnit",
      "manufacturer",
      "variableCost",
      "internalPrice",
      "purchaseNum",
      "purchaseAmount",
      "purchaseMargin",
      "confirmDate",
      "confirmRatio",
      "monthlyRatio",
      "planVersion",
      "lastPlan",
      "purchaseBill",
      "purchaseSave",
      "factoryBill",
      "factorySave"
    ];
    let queryPart = "select " + fields.join(", ") + " from GT7139AT4.GT7139AT4.sy_annualplan";
    let wherePart = " where dr = 0 and enable = 1 and isLasted = 'Y' and purchaseOrg = " + orgid + " and yearly = '" + yearly + "' ";
    if (isBudget) {
      wherePart += " and plansourcetype = 'B' ";
    }
    return queryPart + wherePart;
  }
}
exports({ entryPoint: QueryPurchaseAnnualHandler });