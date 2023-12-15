viewModel.get("yeardistribution_1507398478674264065") &&
  viewModel.get("yeardistribution_1507398478674264065").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    let gridModel = viewModel.getGridModel();
    const rows = gridModel.getRows();
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        actionState[action.cItemName] = { visible: true };
        if (data.verifystate == 0) {
          if (action.cItemName == "button13gj") {
            actionState[action.cItemName] = { visible: false };
          }
        } else if (data.verifystate == 2) {
          if (action.cItemName == "btnEdit") {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName == "button16lg") {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });