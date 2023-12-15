let AbstractTrigger = require("AbstractTrigger");
class PurchaseMonthlyDeleteRule extends AbstractTrigger {
  execute(context, param) {
    let { data: bills } = context;
    if (!bills || bills.length <= 0) {
      return null;
    }
    for (let i = 0; i < bills.length; i++) {
      let { id: parentId } = bills[i];
      let originPlans = ObjectStore.queryByYonQL("select * from GT7139AT4.GT7139AT4.sy_monthlyplans where purchaseBill = '" + parentId + "'");
      if (!originPlans || originPlans.lenght <= 0) {
        continue;
      }
      let deletePlans = [];
      let updatePlans = [];
      for (let plan of originPlans) {
        if (!plan.lastPlan) {
          // 无上一版计划信息，即由年计划产生，单据删除时直接删除
          deletePlans.push({ id: plan.id });
        } else {
          // 删除此版本记录，上一版记录更新为最新版
          deletePlans.push({ id: plan.id });
          updatePlans.push({ id: plan.lastPlan, isLasted: "Y", _status: "Update" });
        }
      }
      if (deletePlans && deletePlans.length > 0) {
        let deleteRes = ObjectStore.deleteBatch("GT7139AT4.GT7139AT4.sy_monthlyplans", deletePlans);
      }
      if (updatePlans && updatePlans.length > 0) {
        let updateRes = ObjectStore.updateBatch("GT7139AT4.GT7139AT4.sy_monthlyplans", updatePlans);
      }
    }
    return {};
  }
}
exports({ entryPoint: PurchaseMonthlyDeleteRule });