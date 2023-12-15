cb.defineInner([], function () {
  var common_VM_Extend = (function () {
    //列表按钮控制
    var setVoucherListRowButtonState = function (viewModel, gridModel) {
      if (!gridModel) {
        gridModel = viewModel.getGridModel();
      }
      const rows = gridModel.getRows();
      const actions = gridModel.getCache("actions");
      if (!actions) {
        return true;
      }
      const actionsStates = [];
      for (let count = 0; count < rows.length; count++) {
        let data = rows[count];
        const actionState = {};
        for (let i = 0; i < actions.length; i++) {
          let action = actions[i];
          if (data.verifystate == 1) {
            //已审核
            actionState[action.cItemName] = { visible: false };
          } else if (data.verifystate === 0) {
            //开立
            actionState[action.cItemName] = { visible: true };
          } else {
            actionState[action.cItemName] = { visible: false };
          }
        }
        actionsStates.push(actionState);
      }
      gridModel.setActionsState(actionsStates);
    };
    return {
      setVoucherListRowButtonState: setVoucherListRowButtonState
    };
  })();
  return common_VM_Extend;
});