viewModel.get("PreOrderBVOList") &&
  viewModel.get("PreOrderBVOList").getEditRowModel() &&
  viewModel.get("PreOrderBVOList").getEditRowModel().get("nastnum") &&
  viewModel
    .get("PreOrderBVOList")
    .getEditRowModel()
    .get("nastnum")
    .on("valueChange", function (data) {
      // 辅数量--值改变
    });