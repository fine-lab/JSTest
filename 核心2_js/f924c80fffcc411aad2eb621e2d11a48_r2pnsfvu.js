let AbstractTrigger = require("AbstractTrigger");
class PurchaseMonthlySaveRule extends AbstractTrigger {
  execute(context, param) {
    let { data: bills } = param;
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
      let needInsertPlans = [];
      let needRewriteItems = [];
      let needUpdateMonthly = [];
      for (let item of originItems) {
        if (item.sourceAnnualPlan && !item.sourcePlan) {
          // 通过年度计划生成的新行, 需要: 插入月度计划+回写单据明细行
          needInsertPlans.push(this.createNewMothlyPlan(bills[i], item));
          needRewriteItems.push(item);
        } else if (item.sourcePlan && item.isCopyed !== "Y") {
          // 修订上一版月度计划，需要: 更新上一版计划+复制新计划+回写单据明细行
          let newMonthlyPlan = this.createNewMothlyPlan(bills[i], item);
          newMonthlyPlan.lastPlan = item.sourcePlan;
          needInsertPlans.push(newMonthlyPlan);
          needRewriteItems.push(item);
          needUpdateMonthly.push({ id: item.sourcePlan, isLasted: "N", _status: "Update" });
        } else if (item.sourcePlan && item.isCopyed === "Y") {
          // 只需要更新月度计划行
          needUpdateMonthly.push(this.getUpdateMonthlyPlan(item));
        }
      }
      if (needInsertPlans && needInsertPlans.length > 0) {
        let insertRes = ObjectStore.insertBatch("GT7139AT4.GT7139AT4.sy_monthlyplans", needInsertPlans, "71ab05d5");
        let rewriteItems = this.getRewriteItems(needRewriteItems, insertRes);
        if (rewriteItems && rewriteItems.length > 0) {
          let rewriteRes = ObjectStore.updateBatch("GT7139AT4.GT7139AT4.sy_busiorderitem", rewriteItems, "b02f63f1");
        }
      }
      if (needUpdateMonthly && needUpdateMonthly.length > 0) {
        let updateRes = ObjectStore.updateBatch("GT7139AT4.GT7139AT4.sy_monthlyplans", needUpdateMonthly, "ec9e9b6c");
      }
    }
    return {};
  }
  getRewriteItems(orderItems, monthlyPlans) {
    if (!orderItems || orderItems.length <= 0 || !monthlyPlans || monthlyPlans.length <= 0) {
      return null;
    }
    let monthlyMap = new Map();
    for (let plan of monthlyPlans) {
      let key = [plan.factoryOrg, plan.material].join("");
      monthlyMap.set(key, plan);
    }
    let rewriteItems = [];
    for (let item of orderItems) {
      let key = [item.factoryOrg, item.material].join("");
      let monthlyPlan = monthlyMap.get(key);
      if (!monthlyPlan) {
        continue;
      }
      rewriteItems.push({ id: item.id, sourcePlan: monthlyPlan.id, isCopyed: "Y", _status: "Update" });
    }
    return rewriteItems;
  }
  createNewMothlyPlan(bill, plan) {
    let keys = [
      "factoryOrg",
      "material",
      "materialcode",
      "specs",
      "approvalUnit",
      "manufacturer",
      "saleNum",
      "salePrice",
      "saleAmount",
      "variableCost",
      "saleMargin",
      "internalPrice",
      "purchaseNum",
      "purchaseAmount",
      "nextMonthNum",
      "nextMonthAmount",
      "manxNum",
      "manxAmount",
      "planNum",
      "sourceAnnualPlan"
    ];
    let monthlyPlan = {};
    for (let key of keys) {
      monthlyPlan[key] = plan[key];
    }
    monthlyPlan.planVersion = 1;
    monthlyPlan.isLasted = "Y";
    monthlyPlan.yearly = bill.yearly;
    monthlyPlan.monthly = bill.monthly;
    monthlyPlan.purchaseOrg = bill.org_id;
    monthlyPlan.purchaseBill = "" + bill.id + "";
    monthlyPlan.purchaseSave = "Y";
    monthlyPlan.purchaseSubmit = "N";
    monthlyPlan.purchaseDone = "N";
    monthlyPlan.factorySave = "N";
    monthlyPlan.factorySubmit = "N";
    monthlyPlan.factoryDone = "N";
    monthlyPlan.enable = 1;
    return monthlyPlan;
  }
  getUpdateMonthlyPlan(item) {
    let keys = ["saleNum", "salePrice", "saleAmount", "variableCost", "saleMargin", "internalPrice", "purchaseNum", "purchaseAmount", "nextMonthNum", "nextMonthAmount", "manxNum", "manxAmount"];
    let updateMothly = {};
    for (let key of keys) {
      updateMothly[key] = item[key];
    }
    updateMothly.id = item.sourcePlan;
    updateMothly._status = "Update";
    return updateMothly;
  }
}
exports({ entryPoint: PurchaseMonthlySaveRule });