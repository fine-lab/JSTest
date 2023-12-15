viewModel.get("parentPartCode_name") &&
  viewModel.get("parentPartCode_name").on("afterValueChange", function (data) {
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
    var id = data.value.id;
    var tt = cb.rest.invokeFunction("GT13970AT1.API.querySun", { id: id }, function (err, res) {}, viewModel, { async: false });
    if (tt.result.arrays != undefined) {
      for (var i = 0; i < tt.result.arrays.length; i++) {
        grid.appendRow(tt.result.arrays[i]);
      }
    }
  });
viewModel.get("BOMCalculationDetailsList") &&
  viewModel.get("BOMCalculationDetailsList").getEditRowModel() &&
  viewModel.get("BOMCalculationDetailsList").getEditRowModel().get("subPartCode_code") &&
  viewModel
    .get("BOMCalculationDetailsList")
    .getEditRowModel()
    .get("subPartCode_code")
    .on("afterValueChange", function (data) {
      // 子件编码--值改变
      debugger;
      var id = data.value[0].id;
      var list = cb.rest.invokeFunction("GT13970AT1.API.addData", { id: id }, function (err, res) {}, viewModel, { async: false });
      var amount = list.result.number;
      var quantity = 0;
      var grid = viewModel.getGridModel("BOMCalculationDetailsList");
      var Row = grid.__data.focusedRowIndex;
      grid.setCellValue(Row, "unitPrice", amount);
      grid.setCellValue(Row, "numberSubParts", quantity);
    });