viewModel.get("button11ng") &&
  viewModel.get("button11ng").on("click", function (data) {
    // 按钮--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.on("customInit", function (data) {
  // 员工查询表--页面初始化
  viewModel.on("beforeSearch", function (args) {
    let GxsStaffFkArr = viewModel.getParams().GxsStaffFkArr;
    args.isExtend = true;
    args.params.condition.simpleVOs = [];
    args.params.condition.simpleVOs.push({
      field: "id",
      op: "eq",
      value1: GxsStaffFkArr[0]
    });
  });
});
viewModel.on("customInit", function (data) {
  //员工查询表--页面初始化
});
viewModel.get("gxsstaff_1675322989773062148") &&
  viewModel.get("gxsstaff_1675322989773062148").on("afterSetDataSource", function (data) {
    //表格--设置数据源后
    let gridModel = viewModel.getGridModel();
    const rows = gridModel.getRows();
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        actionState[action.cItemName] = { visible: true };
        if (data.verifystate == 2) {
          if (action.cItemName == "button3gb") {
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