viewModel.on("customInit", function (data) {
  var gridModel = viewModel.getGridModel();
  gridModel.on("afterCellValueChange", function (data) {
    debugger;
    //拿到行号
    let rowIndex = data.rowIndex;
    if (data.cellName == "shebeibianma_shebeibianma_code") {
      //名称
      var values = data.value.shebeibianma_name;
      //赋值
      gridModel.setCellValue(rowIndex, "shebeibianma_shebeibianma_shebeibianma_code", values);
    }
  });
});