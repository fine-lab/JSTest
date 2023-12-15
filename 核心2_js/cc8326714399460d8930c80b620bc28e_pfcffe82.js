let AbstractTrigger = require("AbstractTrigger");
class FactoryPlanSaveRule extends AbstractTrigger {
  execute(context, param) {
    let { data: bills } = context;
    if (!bills || bills.length <= 0) {
      return null;
    }
    for (let i = 0; i < bills.length; i++) {
      let { id: parentId, isReformulate } = bills[i];
      // 简单点，此规则放到保存规则后，此时数据已经存入数据库
      let originItems = ObjectStore.queryByYonQL("select * from GT7139AT4.GT7139AT4.sy_factoryplanitem where sy_factoryplanitemFk = " + parentId);
      if (!originItems || originItems.lenght <= 0) {
        continue;
      }
      let sourcePlanMap = this.getSourcePlanMap(originItems);
      if (!sourcePlanMap || sourcePlanMap.size <= 0) {
        return {};
      }
      let annualPlans = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_annualplan", { ids: Array.from(sourcePlanMap.keys()) });
      if (!annualPlans || sourcePlanMap.size !== annualPlans.length) {
        throw new Error("查询审批单来源年度预算/计划数据出错！！！");
      }
      let updatePlans = [];
      for (let plan of annualPlans) {
        let updatePlan = this.getUpdatePlan(bills[i], item, plan);
        updatePlans.push(updatePlan);
      }
      if (updatePlans && updatePlans.length > 0) {
        let rewriteRes = ObjectStore.updateBatch("GT7139AT4.GT7139AT4.sy_annualplan", updatePlans);
      }
    }
    return {};
  }
  getSourcePlanMap(items) {
    if (!items || items.length <= 0) {
      return null;
    }
    let sourcePlanMap = new Map();
    for (let item of items) {
      if (item && item.sourcePlan) {
        sourcePlanMap.set(item.sourcePlan, item);
      }
    }
    return sourcePlanMap;
  }
  getUpdatePlan(bill, item, plan) {
    let updateplan = {};
    updateplan.confirmDate_b = plan.confirmDate;
    updateplan.confirmRatio_b = plan.confirmRatio;
    updateplan.monthlyRatio_b = plan.monthlyRatio;
    updateplan.confirmDate = item.confirmDate;
    updateplan.confirmRatio = item.confirmRatio;
    updateplan.monthlyRatio = item.monthlyRatio;
    updateplan.variableCost = item.variableCost;
    updateplan.salePrice = item.salePrice;
    updateplan.saleNum = item.saleNum;
    updateplan.saleAmount = item.saleAmount;
    updateplan.saleMargin = item.saleMargin;
    updateplan.id = item.sourcePlan;
    updateplan.factorySave = "Y";
    updateplan.factoryBill = bill.id;
    updateplan._status = "Update";
    return plan;
  }
}
exports({ entryPoint: FactoryPlanSaveRule });