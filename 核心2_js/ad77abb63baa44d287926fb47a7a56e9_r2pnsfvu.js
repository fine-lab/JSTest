let AbstractTrigger = require("AbstractTrigger");
class BusinessPlanDeleteRule extends AbstractTrigger {
  execute(context, param) {
    let { data: bills } = param;
    if (!bills || bills.length <= 0) {
      return null;
    }
    for (let i = 0; i < bills.length; i++) {
      let { id: parentId, isReformulate } = bills[i];
      let originPlans = ObjectStore.queryByYonQL("select * from GT7139AT4.GT7139AT4.sy_annualplan where purchaseBill = '" + parentId + "'");
      if (!originPlans || originPlans.lenght <= 0) {
        continue;
      }
      let updatePlans = [];
      let deletePlans = [];
      let lastPlanMap = new Map();
      for (let plan of originPlans) {
        if (plan.lastPlan && plan.plansourcetype === "P") {
          // 有上一版计划，且此记录是修订上一版计划
          updatePlans.push({ id: plan.lastPlan, isLasted: "Y", _status: "Update" });
          deletePlans.push({ id: plan.id, _status: "Delete" });
        } else if (plan.lastPlan && plan.plansourcetype === "B") {
          // 有上一版计划，且此记录是新版预算产生
          lastPlanMap.set(plan.lastPlan, plan);
        } else if (!plan.lastPlan && plan.plansourcetype !== "B") {
          // 无上一版计划，且此记录不是预算初始产生
          deletePlans.push({ id: plan.id, _status: "Delete" });
        } else {
          // 无上一版计划，且此记录是预算初始产生
          updatePlans.push(this.resetPlanInfo(plan, null));
        }
      }
      if (lastPlanMap.size > 0) {
        let lastPlanRecords = ObjectStore.selectBatchIds("GT7139AT4.GT7139AT4.sy_annualplan", { ids: Array.from(lastPlanMap.keys()) });
        if (!lastPlanRecords || lastPlanRecords.length < lastPlanMap.size) {
          throw new Error("查询审批单来源年度预算/计划数据出错！！！");
        }
        for (let lastPlan of lastPlanRecords) {
          let plan = lastPlanMap.get(lastPlan.id);
          updatePlans.push(this.resetPlanInfo(plan, lastPlan));
        }
      }
      if (deletePlans && deletePlans.length > 0) {
        let deleteRes = ObjectStore.deleteBatch("GT7139AT4.GT7139AT4.sy_annualplan", deletePlans, "93e4ed26");
      }
      if (updatePlans && updatePlans.length > 0) {
        let updateRes = ObjectStore.updateBatch("GT7139AT4.GT7139AT4.sy_annualplan", updatePlans, "93e4ed26");
      }
    }
    return {};
  }
  resetPlanInfo(plan, lastPlan) {
    let needReFields = ["confirmNum_b", "confirmPrice_b", "confirmAmount_b", "confirmDate_b", "confirmRatio_b", "monthlyRatio_b", "confirmDate", "confirmRatio", "monthlyRatio"];
    let resetPlan = {};
    for (let key of needReFields) {
      resetPlan[key] = lastPlan ? lastPlan[key] : "";
    }
    resetPlan.id = plan.id;
    resetPlan._status = "Update";
    resetPlan.planChanges = "";
    resetPlan.purchaseBill = "";
    resetPlan.purchaseSave = "N";
    return resetPlan;
  }
}
exports({ entryPoint: BusinessPlanDeleteRule });