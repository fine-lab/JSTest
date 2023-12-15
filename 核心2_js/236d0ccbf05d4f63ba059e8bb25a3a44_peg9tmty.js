viewModel.get("button31pi") &&
  viewModel.get("button31pi").on("click", function (data) {
    // 确认--单击
    debugger;
    // 获取主子表所有数据
    var master = viewModel.getAllData();
    var gridModel = viewModel.getGridModel("DeliveryDetailsList");
    // 把主表的复核状态改为 2(已复核)
    viewModel.get("Confirmstatus").setValue(2);
    // 获取行号
    const indexArr = gridModel.getSelectedRowIndexes();
    for (var idx = 0; idx < indexArr.length; idx++) {
      var index = indexArr[idx];
      var rowData = gridModel.getRow(index);
      // 页面上改变选中行的确认状态
      gridModel.setCellValue(index, "Confirmstatus", "1");
    }
  });
viewModel.get("button34wi") &&
  viewModel.get("button34wi").on("click", function (data) {
    // 取消确认--单击
    debugger;
    var masterData = viewModel.getAllData();
    var gridModel = viewModel.getGridModel("DeliveryDetailsList");
    // 把主表复核状态改为 0 未复核
    viewModel.get("Confirmstatus").setValue(0);
    const indexArr = gridModel.getSelectedRowIndexes();
    for (var idx = 0; idx < indexArr.length; idx++) {
      var index = indexArr[idx];
      var rowData = gridModel.getRow(index);
      // 页面上改变选中行的确认状态
      gridModel.setCellValue(index, "Confirmstatus", 0);
    }
  });