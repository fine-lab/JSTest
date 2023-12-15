viewModel.get("changeDetailsDetailsList") &&
  viewModel.get("changeDetailsDetailsList").getEditRowModel() &&
  viewModel.get("changeDetailsDetailsList").getEditRowModel().get("productionWorkNumber.productionWorkNumber") &&
  viewModel
    .get("changeDetailsDetailsList")
    .getEditRowModel()
    .get("productionWorkNumber.productionWorkNumber")
    .on("valueChange", function (data) {
      // 生产工号--值改变
    });