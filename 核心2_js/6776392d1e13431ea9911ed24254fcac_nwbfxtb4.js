viewModel.on("customInit", function (data) {
  // 售后工单情况--页面初始化
  var viewModel = this;
  //获取当前的model
  let gridModel = viewModel.getGridModel();
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
        if (action.cItemName == "btnDelete") {
          if (data.verifystate == 1 || data.verifystate == 2) {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (action.cItemName == "btnEdit") {
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