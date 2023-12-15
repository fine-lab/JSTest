viewModel.get("button13sd") &&
  viewModel.get("button13sd").on("click", function (data) {
    // 转让--单击
  });
viewModel.get("rc_voucher_1590919340295716868") &&
  viewModel.get("rc_voucher_1590919340295716868").on("afterSetDataSource", function (resp) {
    // 表格--设置数据源后
    // 获取表格模型
    var gridModel = viewModel.getGridModel();
    //获取行数据集合
    const rows = gridModel.getRows();
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    console.log(data, "===voucherlist");
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        // 未生效 + 开立态或驳回态  展示编辑和删除按钮
        if (action.cItemName == "btnEdit" || action.cItemName == "btnDelete") {
          if (data.voucherStatus === "1" && (data.verifystate === 0 || data.verifystate === 4)) {
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
viewModel.get("rc_voucher_1590919340295716868") &&
  viewModel.get("rc_voucher_1590919340295716868").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
  });
viewModel.get("rc_voucher_1590919340295716868") &&
  viewModel.get("rc_voucher_1590919340295716868").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
  });