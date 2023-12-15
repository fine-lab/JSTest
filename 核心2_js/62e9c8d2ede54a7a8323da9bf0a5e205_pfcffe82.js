let AbstractTrigger = require("AbstractTrigger");
class FactoryMonthlyDeleteRule extends AbstractTrigger {
  execute(context, param) {
    let { data: bills } = context;
    if (!bills || bills.length <= 0) {
      return null;
    }
    for (let i = 0; i < bills.length; i++) {
      let { id: parentId } = bills[i];
      // 简单点，此规则放到保存规则后，此时数据已经存入数据库
      let originItems = ObjectStore.queryByYonQL("select * from GT7139AT4.GT7139AT4.sy_busiorderitem where sy_busiorderitemFk = " + parentId);
      if (!originItems || originItems.lenght <= 0) {
        continue;
      }
      let updatePlans = [];
      for (let item of originItems) {
        updatePlans.push({ id: item.sourcePlan, factoryBill: "", factorySave: "N", _status: "Update" });
      }
      if (updatePlans && updatePlans.length > 0) {
        let updateRes = ObjectStore.updateBatch("GT7139AT4.GT7139AT4.sy_monthlyplans", updatePlans);
      }
    }
    return {};
  }
}
exports({ entryPoint: FactoryMonthlyDeleteRule });