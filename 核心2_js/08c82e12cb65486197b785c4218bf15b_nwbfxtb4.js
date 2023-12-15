viewModel.on("customInit", function (data) {
  // 收入成本明细-京东--页面初始化
  var viewModel = this;
  let gridModel = viewModel.getGridModel();
  viewModel.on("beforeSearch", function (args) {
    gridModel.setPageSize(5000);
  });
  gridModel.on("afterSetDataSource", () => {
    debugger;
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
        if (action.cItemName == "btnEdit") {
          if (data.verifystate == 2) {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (action.cItemName == "btnDelete") {
          if (data.verifystate == 2) {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
});