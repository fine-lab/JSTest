viewModel.getGridModel().on("afterCellValueChange", function (data) {
  // 字段1--值改变
  if (data.cellName == "new1") {
    viewModel.getGridModel().setCellValue(data.rowIndex, "new2", "5555");
  }
});