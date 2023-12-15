viewModel.get("expend_Information_detailsList") &&
  viewModel.get("expend_Information_detailsList").getEditRowModel() &&
  viewModel.get("expend_Information_detailsList").getEditRowModel().get("productionWorkNumber_productionWorkNumber") &&
  viewModel
    .get("expend_Information_detailsList")
    .getEditRowModel()
    .get("productionWorkNumber_productionWorkNumber")
    .on("afterValueChange", function (data) {
      // 生产工号--值改变
    });