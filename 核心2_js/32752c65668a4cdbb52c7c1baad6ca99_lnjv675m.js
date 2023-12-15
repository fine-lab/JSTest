viewModel.on("customInit", function (data) {
  // 可使用组织管理--页面初始化
});
viewModel.get("manageorg_1633871504464150536") &&
  viewModel.get("manageorg_1633871504464150536").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    let gridModel = viewModel.getGridModel();
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: true };
        if (data.enable == 1) {
          if (action.cItemName === "btnUnstop") {
            actionState[action.cItemName] = { visible: false };
          }
        } else if (data.enable == 0) {
          if (action.cItemName === "btnStop") {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });