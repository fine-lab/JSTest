viewModel.get("TaskorderdetailsList") &&
  viewModel.get("TaskorderdetailsList").getEditRowModel() &&
  viewModel.get("TaskorderdetailsList").getEditRowModel().get("layer") &&
  viewModel
    .get("TaskorderdetailsList")
    .getEditRowModel()
    .get("layer")
    .on("blur", function (data) {
      // 层--失去焦点的回调
      debugger;
      const num = 0;
      var gridModel = viewModel.getGridModel("TaskorderdetailsList");
      gridModel.setCellValue(0, "standing", num);
    });