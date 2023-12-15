viewModel.get("mujianbianma_name") &&
  viewModel.get("mujianbianma_name").on("afterValueChange", function (data) {
    // 母件编码--值改变后
    debugger;
    // 改变后清除所有行
    var gridModel = viewModel.getGridModel();
    var value = data.value;
    var old = data.oldValue;
    if (value == null) {
      gridModel.deleteAllRows();
    }
    var grid = viewModel.getGridModel("BOMCalculationDetailsList");
    // 主表id
    var id = data.value.id;
    // 调用API函数
    var tt = cb.rest.invokeFunction("GT7682AT32.API.querySun", { id: id }, function (err, res) {}, viewModel, { async: false });
    if (tt.result.arrays != undefined) {
      for (var i = 0; i < tt.result.arrays.length; i++) {
        grid.appendRow(tt.result.arrays[i]);
      }
    }
  });
viewModel.get("salesOrderDetiyList") &&
  viewModel.get("salesOrderDetiyList").getEditRowModel() &&
  viewModel.get("salesOrderDetiyList").getEditRowModel().get("zijianbianma_name") &&
  viewModel
    .get("salesOrderDetiyList")
    .getEditRowModel()
    .get("zijianbianma_name")
    .on("afterValueChange", function (data) {
      // 子件编码--值改变
      var id = data.value[0].id;
      // 调用API函数
      var list = cb.rest.invokeFunction("GT7682AT32.API.refresh", { id: id }, function (err, res) {}, viewModel, { async: false });
      // 函数返回的单价
      var amount = list.result.number;
      // 数量
      var quantity = 0;
      var grid = viewModel.getGridModel("BOMCalculationDetailsList");
      // 行号
      var Row = grid.__data.focusedRowIndex;
      grid.setCellValue(Row, "unitPrice", amount);
      grid.setCellValue(Row, "numberSubParts", quantity);
    });