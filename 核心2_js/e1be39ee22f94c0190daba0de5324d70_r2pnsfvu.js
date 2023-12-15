let AbstractAPIHandler = require("AbstractAPIHandler");
class QueryNextAnnualsHandler extends AbstractAPIHandler {
  execute(request) {
    let { budgetSign, conditions } = request;
    if (!budgetSign) {
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
    // 下一版的简单查询方式：
    let nextSql = `select id, budgetSign from GT7139AT4.GT7139AT4.sy_annualplan where dr = 0 and enable = 1 and lastBudgetSign = '${budgetSign}'`;
    let nextPlans = ObjectStore.queryByYonQL(nextSql + wherePart);
    if (!nextPlans || nextPlans.length <= 0) {
      return { planIds: [] };
    }
    let nextBudgetSign = nextPlans[0].budgetSign;
    let thirdSql = `select id, lastPlan from GT7139AT4.GT7139AT4.sy_annualplan where dr = 0 and enable = 1 and lastBudgetSign = '${nextBudgetSign}'`;
    let thirdOrder = " order by planVersion asc";
    let thirdPlans = ObjectStore.queryByYonQL(thirdSql + wherePart + thirdOrder);
    if (!thirdPlans || thirdPlans.length <= 0) {
      return { planIds: [] };
    }
    // 放弃依赖排序，保证数据的准确性优先
    let currentVersions = new Set();
    let lastVersions = new Set();
    for (let plan of thirdPlans) {
      currentVersions.add(plan.id);
    }
    for (let plan of thirdPlans) {
      if (currentVersions.has(plan.lastPlan)) {
        continue;
      }
      lastVersions.add(plan.lastPlan);
    }
    return { planIds: Array.from(lastVersions) };
  }
}
exports({ entryPoint: QueryNextAnnualsHandler });