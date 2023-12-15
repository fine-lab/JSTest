viewModel.on("customInit", function (data) {
  var gridModel = viewModel.getGridModel();
  //根据审核状态控制按钮显示
  gridModel.on("afterSetDataSource", function (data) {
    //获取行数据集合
    const rows = gridModel.getRows();
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        if (data.verifystate == 2) {
          actionState[action.cItemName] = { visible: false };
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
});