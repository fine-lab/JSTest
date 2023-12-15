function initExt(event) {
  var viewModel = this;
  viewModel.get("btnAddRow").setVisible(false);
  viewModel.get("btnEdit").setVisible(false);
  viewModel.get("btnBatchSave").setVisible(false);
  viewModel.get("btnRefresh").setVisible(false);
  viewModel.get("btnAbandon").setVisible(false);
  viewModel.get("btnDeleteBatch").setVisible(false);
  viewModel.getGridModel().setPagination(false);
  viewModel.getGridModel().setState("showColumnSetting", false); // 栏目设置禁用
  viewModel.on("beforeSearch", function (event) {
    let { data, params } = event || {};
    let viewModel = this;
    if (!data || !params) {
      let gridModel = viewModel.getGridModel();
      gridModel.clear();
      return false;
    }
    let { commonVOs } = data.condition || {};
    if (!commonVOs || commonVOs.length <= 0) {
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
    cb.rest.invokeFunction("e60ae4b7fdde42c39bfe506ee0e2e673", { conditions }, function (err, res) {
      let { monthlyPlans } = res || {};
      let gridModel = viewModel.getGridModel();
      gridModel.clear();
      gridModel.insertRows(0, monthlyPlans);
      hideGridDelAction(gridModel);
    });
    return false;
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