viewModel.get("presale_bList") &&
  viewModel.get("presale_bList").getEditRowModel() &&
  viewModel.get("presale_bList").getEditRowModel().get("num") &&
  viewModel
    .get("presale_bList")
    .getEditRowModel()
    .get("num")
    .on("valueChange", function (data) {
      // 预售阈值--值改变
    });