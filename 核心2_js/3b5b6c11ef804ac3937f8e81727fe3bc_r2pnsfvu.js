function initExt(event) {
  let viewModel = this;
  viewModel.get("btnAddRow").setVisible(false);
  viewModel.get("btnEdit").setVisible(false);
  viewModel.get("btnBatchSave").setVisible(false);
  viewModel.get("btnRefresh").setVisible(false);
  viewModel.get("btnAbandon").setVisible(false);
  viewModel.get("btnDeleteBatch").setVisible(false);
  viewModel.getGridModel().setPagination(false);
  viewModel.getGridModel().setState("showColumnSetting", false); // 栏目设置禁用
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      // 进行查询区相关扩展
      let yearlyModel = filtervm.get("yearly").getFromModel();
      let yearly = yearlyModel.getValue();
      if (!yearly) {
        yearlyModel.setValue(new Date().getFullYear(), true);
      }
    });
  });
  viewModel.on("beforeSearch", function (event) {
    let { data, params } = event || {};
    let viewModel = this;
    if (!data || !params) {
      let gridModel = viewModel.getGridModel();
      gridModel.clear();
      return false;
    }
    let { commonVOs } = data.condition || {};
    if (!commonVOs || commonVOs.length <= 2) {
      let gridModel = viewModel.getGridModel();
      gridModel.clear();
      return false;
    }
    let conditions = {};
    for (let filter of commonVOs) {
      if (filter.itemName !== "schemeName" && filter.itemName !== "isDefault") {
        conditions[filter.itemName] = filter.value1;
      }
    }
    if (!conditions.yearly) {
      conditions.yearly = new Date().getFullYear();
    }
    cb.rest.invokeFunction("b7bf7aec724742ada4db86553b5f991c", { conditions }, function (err, res) {
      let { annualPlans } = res || {};
      let gridModel = viewModel.getGridModel();
      gridModel.clear();
      gridModel.insertRows(0, annualPlans);
      hideGridDelAction(gridModel);
    });
    return false;
  });
  // 上一版
  viewModel.get("button5rg").on("click", function (event) {
    console.warn("Previous: ", event);
    let selectedRows = viewModel.getGridModel().getSelectedRows();
    if (!selectedRows || selectedRows.length <= 0) {
      return;
    }
    let lastPlanIds = [];
    for (let row of selectedRows) {
      row.lastPlan && lastPlanIds.push(row.lastPlan);
    }
    if (lastPlanIds.length <= 0) {
      cb.utils.alert({ type: "info", title: "选中的记录为初始版本，无上一版信息" });
      return;
    }
    cb.rest.invokeFunction("2b7c192e7f0348f9b0ed6f32eab48731", { ids: lastPlanIds }, function (err, res) {
      let { annualPlans } = res || {};
      let gridModel = viewModel.getGridModel();
      gridModel.clear();
      gridModel.insertRows(0, annualPlans);
      hideGridDelAction(gridModel);
    });
  });
  viewModel.getGridModel().on("afterStateRuleRunGridActionStates", function (event) {
    let gridModel = this;
    hideGridDelAction(gridModel);
  });
  function hideGridDelAction(gridModel) {
    //获取列表所有数据
    let rows = gridModel.getRows();
    //从缓存区获取按钮
    let actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach(function (row) {
      const actionState = {};
      actions.forEach(function (action) {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: false };
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  }
}