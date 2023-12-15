let AbstractTrigger = require("AbstractTrigger");
class FactoryMonthlySaveRule extends AbstractTrigger {
  execute(context, param) {
    let { data: bills } = param;
    if (!bills || bills.length <= 0) {
      return null;
    }
    for (let i = 0; i < bills.length; i++) {
      let { id: parentId } = bills[i];
      // 简单点，此规则放到保存规则后，此时数据已经存入数据库
      let originItems = ObjectStore.queryByYonQL("select * from GT7139AT4.GT7139AT4.sy_factoryorderitem where sy_factoryorderitemFk = " + parentId);
      if (!originItems || originItems.lenght <= 0) {
        continue;
      }
      let updatePlans = [];
      for (let item of originItems) {
        let updateplan = {};
        updateplan.id = item.sourcePlan;
        updateplan.factoryBill = item.bills[i].id;
        updateplan.factorySave = "Y";
        updateplan.saleNum = item.saleNum;
        updateplan.salePrice = item.salePrice;
        updateplan.saleAmount = item.saleAmount;
        update.saleMargin = item.saleMargin;
        updateplan._status = "Update";
        updatePlans.push(updateplan);
      }
      if (updatePlans && updatePlans.length > 0) {
        let updateRes = ObjectStore.updateBatch("GT7139AT4.GT7139AT4.sy_monthlyplans", updatePlans, "ec9e9b6c");
      }
    }
    return {};
  }
}
exports({ entryPoint: FactoryMonthlySaveRule });