viewModel.on("customInit", function (data) {
  // 法人入社登记--页面初始化
});
viewModel.get("coopmember_c_1538224481186611204") &&
  viewModel.get("coopmember_c_1538224481186611204").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    var gridModel = viewModel.getGridModel();
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
          if (action.cItemName === "button27vj") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (data.verifystate === 2) {
          if (action.cItemName === "button18oi") {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName === "btnEdit") {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName === "btnDelete") {
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
viewModel.get("button32mb") &&
  viewModel.get("button32mb").on("click", function (data) {
    // 批量审核--单击
  });