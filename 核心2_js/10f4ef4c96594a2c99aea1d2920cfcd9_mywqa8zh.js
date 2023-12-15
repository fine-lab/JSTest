viewModel.get("task_1529415108107698183") &&
  viewModel.get("task_1529415108107698183").on("afterSelect", function (data) {
    // 表格--选择后
    debugger;
    var currentRow = viewModel.getGridModel().getRow(data);
    if (currentRow.hetonghao == "1529416070179848199") {
      viewModel.get("btnBizFlowBatchPush").setDisabled(true);
    }
  });
viewModel.get("task_1529415108107698183") &&
  viewModel.get("task_1529415108107698183").on("afterUnselect", function (data) {
    // 表格--取消选中后
    debugger;
    var currentRow = viewModel.getGridModel().getRow(data);
    if (currentRow.hetonghao == "1529416070179848199") {
      viewModel.get("btnBizFlowBatchPush").setDisabled(false);
    }
  });