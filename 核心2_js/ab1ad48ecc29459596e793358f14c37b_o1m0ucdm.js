var gridmodel = viewModel.get("cgndjh_1601950981124784128");
gridmodel &&
  gridmodel.on("afterCellValueChange", function (data) {
    // 表格--单元格值改变后
    var x = gridmodel.getRow(data.rowIndex);
    var oddmoney = 0;
    if (x.yymoney) {
      oddmoney = x.planmoney - x.yymoney;
    } else {
      oddmoney = x.planmoney;
    }
    gridmodel.setCellValue(data.rowIndex, "oddmoney", oddmoney, true);
  });