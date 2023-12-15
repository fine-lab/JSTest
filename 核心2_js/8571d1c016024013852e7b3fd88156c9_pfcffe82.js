let AbstractAPIHandler = require("AbstractAPIHandler");
class PushPlanAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { yearly, annualbudgets, isModified } = request;
    if (!isModified) {
      return { code: 200, success: true, message: "预算信息未更新，无需进行同步...", data: [] };
    }
    let lastedPlans = ObjectStore.queryByYonQL("select * from GT7139AT4.GT7139AT4.sy_annualplan where yearly = '" + yearly + "' and isLasted = 'Y' and enable = 1 and dr = 0");
    let defaultKeyValue = { yearly: yearly, isLasted: "Y", purchaseSave: "N", purchaseSubmit: "N", purchaseDone: "N", factorySave: "N", factorySubmit: "N", factoryDone: "N", enable: 1, dr: 0 };
    let uniqueKeys = ["yearly", "purchaseOrg", "factoryOrg", "material"];
    let combineKeys = ["saleNum", "salePrice", "saleAmount", "saleMargin", "variableCost", "internalPrice", "purchaseNum", "purchaseAmount", "purchaseMargin"];
    if (!lastedPlans || lastedPlans.length <= 0) {
      defaultKeyValue.planVersion = 1;
      // 无最新版计划，即：执行新计划插入
      this.fillPlans(defaultKeyValue, annualbudgets);
      let plans = ObjectStore.insertBatch("GT7139AT4.GT7139AT4.sy_annualplan", annualbudgets, "fc5b5981");
      return { code: 200, message: "预算数据同步成功！", success: true, data: plans };
    }
    // 商业已保存 -> 商业已提交 -> 商业已审批 -> 工业已保存 -> 工业已提交 -> 工业已审批
    let unSave = 0; // 商业都未保存
    let purUnSubmit = 0; // 是否有商业公司未提交的计划
    let ftyUnSubmit = 0; // 是否有工业公司未提交的计划
    let purBillSet = new Set();
    let fctBillSet = new Set();
    for (let plan of lastedPlans) {
      if (plan.purchaseSave === "N") {
        unSave++;
      }
      if (plan.purchaseSave === "Y" && plan.purchaseSubmit === "N") {
        purUnSubmit++;
      }
      if (plan.factorySave === "Y" && plan.factorySubmit === "N") {
        ftyUnSubmit++;
      }
      purBillSet.add(plan.purchaseBill);
      fctBillSet.add(plan.factoryBill);
    }
    if (unSave === lastedPlans.length) {
      // 商业&&工业未做审批单，此时可直接同步合并，版本+1
      // 原有的新版计划变更为旧版
      let modifiedplans = this.copyPlans(["id", "isLasted"], lastedPlans);
      this.fillPlans({ _status: "Update", isLasted: "N" }, modifiedplans);
      modifiedplans = ObjectStore.updateBatch("GT7139AT4.GT7139AT4.sy_annualplan", modifiedplans);
      // 新计划合并预算信息后插入，即新版计划
      defaultKeyValue.planVersion = lastedPlans[0].planVersion + 1;
      annualbudgets = this.combinePlansAndBudgets(annualbudgets, uniqueKeys, combineKeys, lastedPlans);
      this.fillPlans(defaultKeyValue, annualbudgets);
      let plans = ObjectStore.insertBatch("GT7139AT4.GT7139AT4.sy_annualplan", annualbudgets, "fc5b5981");
      return { code: 200, success: true, message: "预算数据同步成功！", data: plans };
    }
    if (purUnSubmit < lastedPlans.length) {
      // 商业计划保存但是未提交
      return { code: 701, success: false, message: "存在商业公司未提交的计划，无法执行预算同步，请稍后再试...", data: [] };
    }
    if (ftyUnSubmit < lastedPlans.length) {
      // 工业计划保存但是未提交
      return { code: 701, success: false, message: "存在工业公司未提交的计划，无法执行预算同步，请稍后再试...", data: [] };
    }
    let billIds = this.getBillCondition(purBillSet);
    let bills = null;
    if (billIds.length > 0) {
      bills = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_businessplan", billIds);
      // 商业计划未审批完成
      if (this.existsUnApproveBill(bills)) {
        return { code: 702, success: false, message: "存在商业公司未审批的计划，无法执行预算同步，请稍后再试...", data: [] };
      }
    }
    bills = null;
    billIds = this.getBillCondition(fctBillSet);
    if (billIds.length > 0) {
      bills = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_businessplan", billIds);
      if (this.existsUnApproveBill(bills)) {
        // 工业计划未审批完成
        return { code: 702, success: false, message: "存在工业公司未审批的计划，无法执行预算同步，请稍后再试...", data: [] };
      }
    }
    // 原有的新版计划变更为旧版
    let modifiedplans = this.copyPlans(["id", "isLasted"], lastedPlans);
    this.fillPlans({ _status: "Update", isLasted: "N" }, modifiedplans);
    modifiedplans = ObjectStore.updateBatch("GT7139AT4.GT7139AT4.sy_annualplan", modifiedplans);
    // 新计划合并预算信息后插入，即新版计划
    defaultKeyValue.planVersion = lastedPlans[0].planVersion + 1;
    annualbudgets = this.combinePlansAndBudgets(annualbudgets, uniqueKeys, combineKeys, lastedPlans);
    this.fillPlans(defaultKeyValue, annualbudgets);
    let plans = ObjectStore.insertBatch("GT7139AT4.GT7139AT4.sy_annualplan", annualbudgets, "fc5b5981");
    return { code: 200, success: true, message: "预算数据同步成功！", data: plans };
  }
  copyPlans(keys, annualplans) {
    let plans = [];
    if (keys && keys.length > 0 && annualplans && annualplans.length > 0) {
      annualplans.forEach(function (item) {
        let plan = {};
        for (let key of keys) {
          plan[key] = item[key];
        }
        plans.push(plan);
      });
    }
    return plans;
  }
  combinePlansAndBudgets(budgets, uniqueKeys, combineKeys, plans) {
    if (!plans || plans.length <= 0 || !budgets || budgets.length <= 0 || !uniqueKeys || uniqueKeys.length <= 0) {
      return budgets;
    }
    let planMap = new Map();
    for (let plan of plans) {
      let keyStr = "";
      for (let key of uniqueKeys) {
        keyStr = keyStr.concat(plan[key]);
      }
      planMap.set(keyStr, plan);
    }
    for (let budget of budgets) {
      if (!budget.modified) {
        continue;
      }
      let keyStr = "";
      for (let key of uniqueKeys) {
        keyStr = keyStr.concat(budget[key]);
      }
      let plan = planMap.get(keyStr);
      if (plan && combineKeys && combineKeys.length > 0) {
        for (let key of combineKeys) {
          budget[key] = plan[key];
        }
      }
    }
    return budgets;
  }
  fillPlans(keyValue, annualplans) {
    if (keyValue && annualplans && annualplans.length > 0) {
      annualplans.forEach(function (plan) {
        for (let key in keyValue) {
          plan[key] = keyValue[key];
        }
      });
    }
    return annualplans;
  }
  getBillCondition(billIds) {
    let conditions = [];
    if (!billIds) {
      return conditions;
    }
    billIds.forEach(function (value) {
      conditions.push({ id: value });
    });
    return conditions;
  }
  existsUnApproveBill(...bills) {
    let exists = false;
    if (!bills || bills.length <= 0) {
      return false;
    }
    for (let bill in bills) {
      if (bill.verifystate !== 2) {
        exists = true;
        break;
      }
    }
    return exists;
  }
}
exports({ entryPoint: PushPlanAPIHandler });