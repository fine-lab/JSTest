viewModel.on("customInit", function (data) {
  var gridModel = viewModel.getGridModel();
  // 入社登记--页面初始化
  gridModel.on("afterSetDataSource", () => {
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
        if (data.verifystate === 0) {
          if (action.cItemName === "button33xj") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (data.verifystate === 2) {
          if (action.cItemName === "button28mj") {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName === "btnEdit") {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName === "btnDelete") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (data.JoinStockFlag === "0" && data.verifystate === 0) {
          if (action.cItemName === "btnDelete") {
            actionState[action.cItemName] = { visible: true };
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });
});