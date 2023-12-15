function initExt(event) {
  let viewModel = this;
  viewModel.getGridModel().setState("showColumnSetting", false); // 栏目设置禁用
  // 页面初始化后禁用自动查询
  viewModel.getParams().autoLoad = false;
  viewModel.setCache("querySimpleVOs", []);
  viewModel.setCache("queryVersionMode", 0); // 查询版本方式：0-最新版，1-下一版，(-1)-上一版
  viewModel.addListener({ setPlanColumnVisible: setPlanColumnVisible.bind(null, viewModel) });
  viewModel.on("afterMount", function () {
    viewModel.doPropertyChange("setPlanColumnVisible", false);
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
  });
  viewModel.on("beforeSearch", function (event) {
    let { data, params } = event || {};
    let { commonVOs } = params.condition || {};
    let couldSearch = false;
    if (!commonVOs || commonVOs.length <= 0) {
      return couldSearch;
    }
    let conditions = [];
    for (let filter of commonVOs) {
      if (filter.itemName === "schemeName" || filter.itemName === "isDefault") {
        continue;
      }
      conditions.push(filter);
      couldSearch = couldSearch || !!filter.value1;
    }
    if (couldSearch) {
      let querySimpleVOs = viewModel.getCache("querySimpleVOs");
      let queryVersionMode = viewModel.getCache("queryVersionMode");
      // 上一版或者下一版查询继续使用querySimpleVOs进行查询，但是需要重置为默认最新版查询
      if (queryVersionMode !== 0) {
        viewModel.setCache("queryVersionMode", 0);
        viewModel.setCache("querySimpleVOs", []);
      }
      if (!querySimpleVOs || querySimpleVOs.length <= 0) {
        // 默认查询最新版
        querySimpleVOs.push({ field: "isLasted", op: "eq", value1: "Y" });
      }
      params.condition.simpleVOs = querySimpleVOs;
      let queryParams = { conditions: conditions, simpleFilters: params.condition.simpleVOs };
      let { result } = invokeFunction("1b53a070cf764a258db7faeb8e462814", queryParams, null, { async: false });
      viewModel.getGridModel().setPageInfo({ pageSize: result.count || 0, pageCount: 1, pageIndex: 1 });
      viewModel.doPropertyChange("setPlanColumnVisible", false);
    }
    return couldSearch;
  });
  viewModel.get("lastVersion").on("click", function (event) {
    viewModel.setCache("queryVersionMode", 0);
    let querySimpleVOs = viewModel.getCache("querySimpleVOs");
    querySimpleVOs.length = 0;
    let queryCondition = viewModel.getCache("lastSearchCondition");
    viewModel.biz.do("search", viewModel, queryCondition);
  });
  // 上一版
  viewModel.get("previousVersion").on("click", function (event) {
    let conditions = getLastQueryCondition(viewModel);
    if (!conditions || conditions.length <= 0) {
      cb.utils.alert("请先执行查询！");
      return;
    }
    let rows = viewModel.getGridModel().getRows();
    console.warn("Previous: ", event, rows);
    if (!rows || rows.length <= 0) {
      return;
    }
    let lastBudgetSign = null;
    let lastPlanIds = [];
    for (let row of rows) {
      let { lastPlan } = row;
      if (!lastBudgetSign) {
        lastBudgetSign = row.lastBudgetSign;
      }
      lastPlanIds.push(lastPlan);
    }
    if (!lastBudgetSign) {
      cb.utils.alert("当前显示的预算已是本年度预算初始版本！");
      return;
    }
    cb.rest.invokeFunction(
      "2b7c192e7f0348f9b0ed6f32eab48731",
      { lastBudgetSign: lastBudgetSign, conditions: conditions },
      function (viewModel, err, res) {
        let { planIds } = res;
        let queryCondition = viewModel.getCache("lastSearchCondition");
        if (!planIds || planIds.length <= 0) {
          viewModel.biz.do("search", viewModel, queryCondition);
        } else {
          viewModel.setCache("queryVersionMode", -1);
          let querySimpleVOs = viewModel.getCache("querySimpleVOs");
          querySimpleVOs.length = 0;
          querySimpleVOs.push({ field: "budgetSign", op: "eq", value1: lastBudgetSign });
          querySimpleVOs.push({ field: "id", op: "in", value1: lastPlanIds });
          viewModel.biz.do("search", viewModel, queryCondition);
        }
      }.bind(null, viewModel)
    );
  });
  viewModel.get("nextVersion").on("click", function (event) {
    let conditions = getLastQueryCondition(viewModel);
    if (!conditions || conditions.length <= 0) {
      cb.utils.alert("请先执行查询！");
      return;
    }
    // 下一版的简单查询方式：1.查下一版的下一版，没有直接查询最新版即可，2. 查询到下下版之后，以lastPlan查询即为最新的下一版
    let rows = viewModel.getGridModel().getRows();
    console.warn("Next: ", event, rows);
    if (!rows || rows.length <= 0) {
      cb.utils.alert("请先执行查询！");
      return;
    }
    let budgetSign = null;
    for (let row of rows) {
      if (!budgetSign) {
        budgetSign = row.budgetSign;
        break;
      }
    }
    cb.rest.invokeFunction(
      "e1be39ee22f94c0190daba0de5324d70",
      { budgetSign: budgetSign, conditions: conditions },
      function (viewModel, err, res) {
        let { planIds } = res;
        let queryCondition = viewModel.getCache("lastSearchCondition");
        if (!planIds || planIds.length <= 0) {
          viewModel.biz.do("search", viewModel, queryCondition);
        } else {
          viewModel.setCache("queryVersionMode", 1);
          let querySimpleVOs = viewModel.getCache("querySimpleVOs");
          querySimpleVOs.length = 0;
          querySimpleVOs.push({ field: "id", op: "in", value1: planIds });
          viewModel.biz.do("search", viewModel, queryCondition);
        }
      }.bind(null, viewModel)
    );
  });
  viewModel.get("showPlanInfo").on("click", function (event) {
    viewModel.doPropertyChange("setPlanColumnVisible", true);
    let rows = viewModel.getGridModel().getRows();
    if (!rows || rows.length <= 0) {
      return;
    }
    let purchaseApproveBills = new Set();
    let factoryApproveBills = new Set();
    for (let row of rows) {
      row.purchaseBill && purchaseApproveBills.add(row.purchaseBill);
      row.factoryBill && factoryApproveBills.add(row.factoryBill);
    }
    cb.rest.invokeFunction(
      "2b09e5b237904513b55ccf8580a7a45f",
      { purchaseApproveBills: Array.from(purchaseApproveBills), factoryApproveBills: Array.from(factoryApproveBills) },
      function (gridModel, err, res) {
        let { purchaseBills, factoryBills } = res;
        let purchaseBill = {};
        let factoryBill = {};
        if (purchaseBills && purchaseBills.length > 0) {
          purchaseBills.forEach(function (bill) {
            purchaseBill[bill.id] = bill;
          });
        }
        if (factoryBills && factoryBills.length > 0) {
          factoryBills.forEach(function (bill) {
            factoryBill[bill.id] = bill;
          });
        }
        let rows = viewModel.getGridModel().getRows();
        if (!rows || rows.length <= 0) {
          return;
        }
        for (let i = 0; i < rows.length; i++) {
          purchase = rows[i].purchaseBill;
          factory = rows[i].factoryBill;
          pbill = purchaseBill[purchase] || {};
          fbill = factoryBill[factory] || {};
          let planstatus = null;
          if (fbill.verifystate === 2) {
            planstatus = "工业已审批";
          } else if (fbill.verifystate === 1) {
            planstatus = "工业审批中";
          } else if (fbill.verifystate === 0) {
            planstatus = "工业未提交";
          } else if (pbill.verifystate === 2) {
            planstatus = "商业已审批";
          } else if (pbill.verifystate === 1) {
            planstatus = "商业审批中";
          } else {
            planstatus = "未提交";
          }
          gridModel.setCellValue(i, "purchaseBillCode", pbill.code, false, false);
          gridModel.setCellValue(i, "factoryBillCode", fbill.code, false, false);
          gridModel.setCellValue(i, "planstatus", planstatus, false, false);
        }
      }.bind(null, viewModel.getGridModel())
    );
  });
  viewModel.get("hidePlanInfo").on("click", function (event) {
    viewModel.doPropertyChange("setPlanColumnVisible", false);
  });
  function getLastQueryCondition(viewModel) {
    let queryCondition = viewModel.getCache("lastSearchCondition");
    if (!queryCondition || !queryCondition.condition) {
      return null;
    }
    let commonVOs = queryCondition.condition.commonVOs || [];
    let conditions = [];
    for (let filter of commonVOs) {
      if (filter.itemName === "schemeName" || filter.itemName === "isDefault") {
        continue;
      }
      conditions.push(filter);
    }
    return conditions;
  }
  function setPlanColumnVisible(viewModel, visible) {
    let gridModel = viewModel.getGridModel();
    gridModel.setColumnState("confirmNum", "visible", visible);
    gridModel.setColumnState("confirmAmount", "visible", visible);
    gridModel.setColumnState("confirmNum_b", "visible", visible);
    gridModel.setColumnState("confirmAmount_b", "visible", visible);
    gridModel.setColumnState("confirmDate", "visible", visible);
    gridModel.setColumnState("confirmRatio", "visible", visible);
    gridModel.setColumnState("monthlyRatio", "visible", visible);
    gridModel.setColumnState("purchaseBillCode", "visible", visible);
    gridModel.setColumnState("factoryBillCode", "visible", visible);
    gridModel.setColumnState("planstatus", "visible", visible);
  }
  function invokeFunction(id, data, callback, options) {
    if (!options) {
      options = {};
    }
    options.domainKey = cb.utils.getActiveDomainKey();
    let proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    return proxy.doProxy(data, callback);
  }
}