viewModel.get("orderProduct") &&
  viewModel.get("orderProduct").getEditRowModel() &&
  viewModel.get("orderProduct").getEditRowModel().get("materialCode") &&
  viewModel
    .get("orderProduct")
    .getEditRowModel()
    .get("materialCode")
    .on("afterValueChange", function (data) {
      // 物料编码--值改变
      var data = data.obj.select;
      var gridModel = viewModel.getGridModel("orderProduct");
      for (var i = 0; i <= data.length; i++) {
        var id = data[i].productId;
        var res = cb.rest.invokeFunction("OSM.shejiqihanshu.getPridoctData", { id: id }, function (err, res) {}, viewModel, { async: false });
        // 转换率
        var rowIndex = gridModel.__data.focusedRowIndex;
        if (res.result.define1.length > 0) {
          var conversionRate = res.result.define1[0].define1;
          if (data.length == 1) {
            gridModel.setCellValue(rowIndex, "orderProductAttrextItem!define5", conversionRate);
          } else {
            gridModel.setCellValue(rowIndex - 1 + i, "orderProductAttrextItem!define5", conversionRate);
          }
        } else {
          // 给定默认1转换率
          if (data.length == 1) {
            gridModel.setCellValue(rowIndex, "orderProductAttrextItem!define5", 1);
          } else {
            gridModel.setCellValue(rowIndex - 1 + i, "orderProductAttrextItem!define5", 1);
          }
        }
      }
    });