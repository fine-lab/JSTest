viewModel.get("fksqmxList") &&
  viewModel.get("fksqmxList").getEditRowModel() &&
  viewModel.get("fksqmxList").getEditRowModel().get("yewuleixing") &&
  viewModel
    .get("fksqmxList")
    .getEditRowModel()
    .get("yewuleixing")
    .on("valueChange", function (data) {
      // 业务类型--值改变
    });
viewModel.get("fksqmxList") &&
  viewModel.get("fksqmxList").on("afterCellValueChange", function (data) {
    // 表格-付款申请明细--单元格值改变后
  });