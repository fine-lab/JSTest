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
      for (var i = 0; i <= data.length; i++) {
        var id = data[i].productId;
        var res = cb.rest.invokeFunction("OSM.frontDesignerFunction.queryProductData", { id: id }, function (err, res) {}, viewModel, { async: false });
        var conversionRate = res.result.define1[0].define1;
        var gridModel = viewModel.getGridModel("orderProduct");
        // 转换率
        gridModel.setCellValue(i, "orderProductAttrextItem!define2", conversionRate);
      }
    });