viewModel.on("customInit", function (data) {});
viewModel.get("agentorg_1499460683335991302") &&
  viewModel.get("agentorg_1499460683335991302").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    var gridModel = viewModel.getGridModel();
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((ele) => {
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: true };
        if (ele.enable == 1) {
          if (action.cItemName == "btnUnstop") {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName == "btnDelete") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (ele.enable == 0) {
          if (action.cItemName == "btnStop") {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 100);
  });