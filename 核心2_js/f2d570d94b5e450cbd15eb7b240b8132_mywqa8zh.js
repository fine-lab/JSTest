viewModel.get("jinjiantalentpoolfile_1525016932752818176") &&
  viewModel.get("jinjiantalentpoolfile_1525016932752818176").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
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
            if (data.verifystate == 1) {
              actionState[action.cItemName] = { visible: false };
            }
          }
        });
        actionsStates.push(actionState);
      });
      gridModel.setActionsState(actionsStates);
    });
  });