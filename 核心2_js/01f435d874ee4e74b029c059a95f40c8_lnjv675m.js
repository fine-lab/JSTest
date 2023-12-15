viewModel.on("customInit", function (data) {
  // 社员成员用户管理--页面初始化
  var gridModel = viewModel.getGridModel();
  // 入社登记--页面初始化
  gridModel.on("afterSetDataSource", () => {
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((dat) => {
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: true };
        if (dat.mobile !== undefined) {
          if (action.cItemName === "button13nc") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (dat.isuser !== "0") {
          if (action.cItemName === "button10fi") {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
});