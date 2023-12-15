viewModel.get("button7gf") &&
  viewModel.get("button7gf").on("click", function (data) {
    // 清空附件--单击
    console.log(data);
    viewModel.getGridModel().setCellValue(data.index, "fujian", undefined);
    viewModel.getGridModel().setCellValue(data.index, "item93wf", undefined);
  });
viewModel.get("button9vd") &&
  viewModel.get("button9vd").on("click", function (data) {
    // 获取附件id--单击
    let gridModel = viewModel.getGridModel();
    let fujianId = gridModel.getCellValue(data.index, "fujian");
    console.log("fujianId:" + fujianId);
    gridModel.setCellValue(data.index, "item93wf", fujianId);
  });