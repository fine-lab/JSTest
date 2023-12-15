viewModel.get("rc_voucher_finance_1591574846809047045") &&
  viewModel.get("rc_voucher_finance_1591574846809047045").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    // 获取表格模型
    var gridModel = viewModel.getGridModel();
    //获取行数据集合
    const rows = gridModel.getRows();
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        // 草拟状态 开立态 展示编辑和删除按钮
        if (action.cItemName == "btnEdit" || action.cItemName == "btnDelete") {
          if (data.finStatus == 1 && data.verifystate == 0) {
            actionState[action.cItemName] = { visible: true };
          } else {
            actionState[action.cItemName] = { visible: false };
          }
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });