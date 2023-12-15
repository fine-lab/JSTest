viewModel.get("purchaseOrders") &&
  viewModel.get("purchaseOrders").getEditRowModel() &&
  viewModel.get("purchaseOrders").getEditRowModel().get("product_cCode") &&
  viewModel
    .get("purchaseOrders")
    .getEditRowModel()
    .get("product_cCode")
    .on("afterValueChange", function (data) {
      // 物料编码--值改变
      var data = data.obj.select;
      var gridModel = viewModel.getGridModel("purchaseOrders");
      let num = 1;
      for (var i = 0; i < data.length; i++) {
        var id = data[i].id;
        var res = cb.rest.invokeFunction("PU.method.queryProductData", { id: id }, function (err, res) {}, viewModel, { async: false });
        // 转换率
        var rowIndex = gridModel.__data.focusedRowIndex;
        if (res.result.define4.length > 0) {
          var ss = res.result.define4[0].define1;
          if (data.length == 1) {
            gridModel.setCellValue(rowIndex, "bodyFreeItem!define4", ss);
          } else {
            gridModel.setCellValue(rowIndex - 1 + i, "bodyFreeItem!define4", ss);
          }
        } else {
          // 给定默认1转换率
          if (data.length == 1) {
            gridModel.setCellValue(rowIndex, "bodyFreeItem!define4", 1);
          } else {
            gridModel.setCellValue(rowIndex - 1 + i, "bodyFreeItem!define4", 1);
          }
        }
      }
    });