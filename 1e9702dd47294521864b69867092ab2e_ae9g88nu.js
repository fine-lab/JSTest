var gridModel = viewModel.getGridModel();
viewModel.get("SY01_suspensionsonList") &&
  viewModel.get("SY01_suspensionsonList").getEditRowModel() &&
  viewModel.get("SY01_suspensionsonList").getEditRowModel().get("produce_time") &&
  viewModel
    .get("SY01_suspensionsonList")
    .getEditRowModel()
    .get("produce_time")
    .on("valueChange", function (data) {
      // 生产日期--值改变
      // 更新时间戳字段
      debugger;
      try {
        gridModel.setCellValue(data.rowIndex, "produce_time", timestampToDate(gridModelInfo.getCellValue(i, "produce_time")));
      } catch (e) {}
    });
viewModel.get("SY01_suspensionsonList") &&
  viewModel.get("SY01_suspensionsonList").getEditRowModel() &&
  viewModel.get("SY01_suspensionsonList").getEditRowModel().get("deadline_time") &&
  viewModel
    .get("SY01_suspensionsonList")
    .getEditRowModel()
    .get("deadline_time")
    .on("valueChange", function (data) {
      // 有效期至--值改变
      // 更新时间戳字段
      try {
        gridModel.setCellValue(data.rowIndex, "deadline_time", timestampToDate(gridModelInfo.getCellValue(i, "deadline_time")));
      } catch (e) {}
    });