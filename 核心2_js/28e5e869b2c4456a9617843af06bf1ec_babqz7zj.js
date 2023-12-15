viewModel.on("customInit", function (data) {
  var gridModel = viewModel.getGridModel();
  //表格数据加载完成-钩子
  gridModel.on("afterSetDataSource", function (data) {
    //获取行数据集合
    const rows = gridModel.getRows();
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      const actionState = {};
      if (action.cItemName == "button30vg") {
        actionState[action.cItemName] = { visible: false };
      } else {
        actionState[action.cItemName] = { visible: true };
      }
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
});
viewModel.get("button45hj") &&
  viewModel.get("button45hj").on("click", function (data) {
    // 按钮--单击
  });