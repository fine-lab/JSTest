let AbstractAPIHandler = require("AbstractAPIHandler");
class QueryPreviousAnnualsHandler extends AbstractAPIHandler {
  execute(request) {
    let { lastBudgetSign, conditions } = request;
    if (!lastBudgetSign) {
      return { planIds: [] };
    }
    let wherePart = "";
    for (let filter of conditions) {
      let { itemName, value1, value2 } = filter;
      if (itemName === "purchaseOrg" || itemName === "factoryName" || itemName === "material") {
        wherePart += ` and ${itemName} = ${value1}`;
      } else if (itemName === "yearly") {
        wherePart += ` and ${itemName} = '${value1}'`;
      } else {
        wherePart += ` and ${itemName} like '${value1}'`;
      }
    }
    // 上一版的简单查询方式：
    let currentSql = `select id, lastPlan from GT7139AT4.GT7139AT4.sy_annualplan where dr = 0 and enable = 1 and lastBudgetSign = '${lastBudgetSign}'`;
    let currentPlans = ObjectStore.queryByYonQL(currentSql + wherePart);
    if (!currentPlans || currentPlans.length <= 0) {
      return { planIds: [] };
    }
    // 放弃依赖排序，保证数据的准确性优先
    let currentVersions = new Set();
    let lastVersions = new Set();
    for (let plan of currentPlans) {
      currentVersions.add(plan.id);
    }
    for (let plan of currentPlans) {
      if (currentVersions.has(plan.lastPlan)) {
        continue;
      }
      lastVersions.add(plan.lastPlan);
    }
    return { planIds: Array.from(lastVersions) };
  }
}
exports({ entryPoint: QueryPreviousAnnualsHandler });