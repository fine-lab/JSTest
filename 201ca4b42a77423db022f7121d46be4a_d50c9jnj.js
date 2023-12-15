viewModel.get("batch_price_1551623920391028745") &&
  viewModel.get("batch_price_1551623920391028745").on("afterSetDataSource", function (data) {
    var gridModel = viewModel.getGridModel();
    //获取行数据集合
    const rows = gridModel.getRows();
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const before = gridModel.getActionsState();
    console.log("beforebeforebeforebefore", before);
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        if (action.cItemName == "button14qi") {
          if (data.verifystate != 0) {
            actionState[action.cItemName] = { visible: false };
          } else {
            actionState[action.cItemName] = { visible: true };
          }
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    console.log("actionsStatesactionsStates1111", actionsStates);
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 10);
    return false;
  });