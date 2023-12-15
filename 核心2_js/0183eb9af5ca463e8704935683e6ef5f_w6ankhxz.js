viewModel.get("rc_org_credit_1590748331877859330") &&
  viewModel.get("rc_org_credit_1590748331877859330").on("afterSetDataSource", function (data) {
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
        // 开立态 展示删除按钮
        if (action.cItemName == "btnDelete") {
          if (data.verifystate == 0) {
            actionState[action.cItemName] = { visible: true };
          } else {
            actionState[action.cItemName] = { visible: false };
          }
        }
        // 启用按钮隐藏
        else if (action.cItemName == "btnUnstop") {
          actionState[action.cItemName] = { visible: false };
        }
        // 展示停用按钮
        else if (action.cItemName == "btnStop") {
          if (data.enable == 1) {
            actionState[action.cItemName] = { visible: true };
          } else {
            actionState[action.cItemName] = { visible: false };
          }
        }
        // 启用按钮隐藏
        else if (action.cItemName == "btnEdit") {
          if (data.verifystate == 0) {
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