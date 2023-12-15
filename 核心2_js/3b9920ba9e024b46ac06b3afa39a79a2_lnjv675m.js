viewModel.get("button39eg") &&
  viewModel.get("button39eg").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("accinitialization_1490087905070678024") &&
  viewModel.get("accinitialization_1490087905070678024").on("afterSetDataSource", function (data) {
    let gridModel = viewModel.getGridModel();
    const rows = gridModel.getRows();
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        actionState[action.cItemName] = { visible: true };
        if (data.verifystate == 0) {
          if (action.cItemName == "button33if") {
            actionState[action.cItemName] = { visible: false };
          }
        } else if (data.verifystate == 2) {
          if (action.cItemName == "button30ze") {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName == "btnEdit") {
            actionState[action.cItemName] = { visible: false };
          }
          if (data.item56xj == "0") {
            if (action.cItemName == "button33if") {
              actionState[action.cItemName] = { visible: true };
            }
          } else if (data.item56xj == "1") {
            if (action.cItemName == "button33if") {
              actionState[action.cItemName] = { visible: false };
            }
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });