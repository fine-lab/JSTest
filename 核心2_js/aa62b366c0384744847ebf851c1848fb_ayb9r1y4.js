viewModel.on("customInit", function (data) {
  // 附加明细情况详情--页面初始化
});
viewModel.get("additionalConditionDetailsList") &&
  viewModel.get("additionalConditionDetailsList").getEditRowModel() &&
  viewModel.get("additionalConditionDetailsList").getEditRowModel().get("productionWorkNumber.productionWorkNumber") &&
  viewModel
    .get("additionalConditionDetailsList")
    .getEditRowModel()
    .get("productionWorkNumber.productionWorkNumber")
    .on("valueChange", function (data) {
      // 生产工号--值改变
      debugger;
      var tt = viewModel.getCellValue(0, "id").getCellValue();
      var res = 0;
    });
viewModel.get("button26ub") &&
  viewModel.get("button26ub").on("click", function (data) {
    // 删除--单击
  });