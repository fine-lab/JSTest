viewModel.get("button7me") &&
  viewModel.get("button7me").on("click", function (data) {
    // 清除附件--单击
    viewModel.getGridModel().setCellValue(data.index, "fujian", undefined);
    viewModel.getGridModel().setCellValue(data.index, "item94kg", undefined);
  });
viewModel.get("button10hb") &&
  viewModel.get("button10hb").on("click", function (data) {
    // 获取附件id--单击
    let gridModel = viewModel.getGridModel();
    let fujianId = gridModel.getCellValue(data.index, "fujian");
    console.log("fujianId:" + fujianId);
    gridModel.setCellValue(data.index, "item94kg", fujianId);
  });