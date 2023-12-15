let AbstractTrigger = require("AbstractTrigger");
class BusinessPlanSaveRule extends AbstractTrigger {
  execute(context, param) {
    let { data: bills } = param;
    if (!bills || bills.length <= 0) {
      return null;
    }
    for (let i = 0; i < bills.length; i++) {
      let { id: parentId, isReformulate } = bills[i];
      // 简单点，此规则放到保存规则后，此时数据已经存入数据库
      let originItems = ObjectStore.queryByYonQL("select * from GT7139AT4.GT7139AT4.sy_businessplanitem where sy_businessplanitemFk = " + parentId);
      if (!originItems || originItems.lenght <= 0) {
        continue;
      }
      let sourceMap = new Map();
      let needInsertPlans = [];
      let needRewriteItems = [];
      let needUpdatePlans = [];
      for (let item of originItems) {
        if (item.sourcePlan && item.isCopyed !== "Y") {
          // 需复制计划行+回写
          sourceMap.set(item.sourcePlan, item);
        } else if (item.sourcePlan && item.isCopyed === "Y") {
          // 只需要回写
          needUpdatePlans.push(this.getUpdateAnnualPlan(bills[i], item));
        } else if (!item.sourcePlan) {
          // 生成新的计划行+回写
          let newPlan = this.createNewAnnualPlan(bills[i], item);
          newPlan.plansourcetype = "A";
          newPlan.planChanges = "Add";
          needInsertPlans.push(newPlan);
          needRewriteItems.push(item);
        }
      }
      if (sourceMap.size > 0) {
        let annualPlans = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_annualplan", { ids: Array.from(sourceMap.keys()) });
        if (!annualPlans || annualPlans.length < sourceMap.size) {
          throw new Error("查询审批单来源年度预算/计划数据出错！！！");
        }
        for (let plan of annualPlans) {
          let item = sourceMap.get(plan.id);
          let newPlan = this.createNewAnnualPlan(bills[i], item);
          newPlan.plansourcetype = "P";
          if (item.isChanged === "Y") {
            newPlan.planChanges = "Update";
          }
          this.copyBudgetInfo(newPlan, plan);
          needInsertPlans.push(newPlan);
          needRewriteItems.push(item);
          needUpdatePlans.push({ id: plan.id, isLasted: "N", _status: "Update" });
        }
      }
      if (needInsertPlans && needInsertPlans.length > 0) {
        let insertRes = ObjectStore.insertBatch("GT7139AT4.GT7139AT4.sy_annualplan", needInsertPlans, "93e4ed26");
        let rewriteItems = this.getReFillSourceItems(bills[i], needRewriteItems, insertRes);
        if (rewriteItems && rewriteItems.length > 0) {
          let rewriteRes = ObjectStore.updateBatch("GT7139AT4.GT7139AT4.sy_businessplanitem", rewriteItems, "cf4a61c5");
        }
      }
      if (needUpdatePlans && needUpdatePlans.length > 0) {
        let updateRes = ObjectStore.updateBatch("GT7139AT4.GT7139AT4.sy_annualplan", needUpdatePlans, "93e4ed26");
      }
    }
    return {};
  }
  getReFillSourceItems(bill, noSourceItems, insertPlans) {
    if (!noSourceItems || noSourceItems.length <= 0 || !insertPlans || insertPlans.length <= 0) {
      return null;
    }
    let planMap = new Map();
    for (let plan of insertPlans) {
      let key = [plan.yearly, plan.purchaseOrg, plan.factoryOrg, plan.material].join("");
      planMap.set(key, plan);
    }
    let refillItems = [];
    for (let item of noSourceItems) {
      let key = [bill.yearly, bill.org_id, item.factoryOrg, item.material].join("");
      let plan = planMap.get(key);
      refillItems.push({ id: item.id, sourcePlan: plan.id, isCopyed: "Y", _status: "Update" });
    }
    return refillItems;
  }
  getUpdateAnnualPlan(bill, item) {
    let plan = {};
    plan.confirmDate_b = item.confirmDate;
    plan.confirmRatio_b = item.confirmRatio;
    plan.monthlyRatio_b = item.monthlyRatio;
    plan.confirmDate = item.confirmDate;
    plan.confirmRatio = item.confirmRatio;
    plan.monthlyRatio = item.monthlyRatio;
    plan.confirmNum_b = item.purchaseNum;
    plan.confirmPrice_b = item.internalPrice;
    plan.confirmAmount_b = item.purchaseAmount;
    plan.id = item.sourcePlan;
    plan.purchaseBill = bill.id;
    plan.purchaseSave = "Y";
    if (item.isChanged === "Y") {
      plan.planChanges = "Update";
    }
    plan._status = "Update";
    return plan;
  }
  copyBudgetInfo(plan, budget) {
    let needCopyFields = ["variableCost", "saleNum", "salePrice", "saleAmount", "saleMargin", "budgetChanges"];
    for (let key of needCopyFields) {
      plan[key] = budget[key];
    }
    plan.planVersion = budget.planVersion + 1;
    plan.lastPlan = budget.id;
    return plan;
  }
  createNewAnnualPlan(bill, item) {
    let needCopyFields = [
      "factoryOrg",
      "material",
      "specs",
      "approvalUnit",
      "manufacturer",
      "confirmDate",
      "confirmRatio",
      "monthlyRatio",
      "variableCost",
      "internalPrice",
      "purchaseNum",
      "purchaseAmount",
      "purchaseMargin"
    ];
    let plan = {};
    for (let key of needCopyFields) {
      plan[key] = item[key];
    }
    plan.id = null;
    plan.yearly = bill.yearly;
    plan.purchaseOrg = bill.org_id;
    plan.purchaseBill = bill.id;
    plan.confirmNum_b = item.purchaseNum;
    plan.confirmPrice_b = item.internalPrice;
    plan.confirmAmount_b = item.purchaseAmount;
    plan.confirmDate_b = item.confirmDate;
    plan.confirmRatio_b = item.confirmRatio;
    plan.monthlyRatio_b = item.monthlyRatio;
    plan.budgetSign = item.budgetSign;
    plan.lastBudgetSign = item.lastBudgetSign;
    plan.planVersion = 1;
    plan.isLasted = "Y";
    plan.purchaseSave = "Y";
    plan.factorySave = "N";
    plan.purchaseSubmit = "N";
    plan.factorySubmit = "N";
    plan.purchaseDone = "N";
    plan.factoryDone = "N";
    return plan;
  }
}
exports({ entryPoint: BusinessPlanSaveRule });