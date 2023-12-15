viewModel.on("customInit", function (data) {
  // 社员入股单--页面初始化
  var gridModel = viewModel.getGridModel();
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
        if (data.verifystate !== 0) {
          if (action.cItemName === "btnEdit") {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName === "btnDelete") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (data.verifystate === 0) {
          if (action.cItemName === "button16qi") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (data.verifystate === 2) {
          if (action.cItemName === "button22hh") {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
});
viewModel.get("button27sa") &&
  viewModel.get("button27sa").on("click", function (data) {
    // 生成凭证--单击
    console.log("data", JSON.stringify(data));
    let gridData = viewModel.getGridModel().getSelectedRows();
    console.log("gridData", JSON.stringify(gridData));
    let gridDataLength = gridData.length;
    if (gridDataLength == 0) {
      cb.utils.alert("请选择至少一条数据！", "info");
    }
  });