viewModel.get("sales_ReportDetailsList") &&
  viewModel.get("sales_ReportDetailsList").getEditRowModel() &&
  viewModel.get("sales_ReportDetailsList").getEditRowModel().get("product_code") &&
  viewModel
    .get("sales_ReportDetailsList")
    .getEditRowModel()
    .get("product_code")
    .on("afterValueChange", function (data) {
      // 物料--值改变
      debugger;
      var orgId = viewModel.get("org_id").getValue();
      var gridModel = viewModel.getGridModel();
      var data = gridModel.__data;
      var ds = data.dataSource[0];
      var id = ds.product;
      var params = {
        pro_id: id,
        org_id: orgId
      };
      var rsu = cb.rest.invokeFunction("GT5646AT1.apifunction.selectMaterial", { sku: params }, function (err, res) {}, viewModel, { async: false });
      // 计量单位
    });
viewModel.get("sales_ReportDetailsList") &&
  viewModel.get("sales_ReportDetailsList").getEditRowModel() &&
  viewModel.get("sales_ReportDetailsList").getEditRowModel().get("product.code") &&
  viewModel
    .get("sales_ReportDetailsList")
    .getEditRowModel()
    .get("product.code")
    .on("valueChange", function (data) {
      // 物料--值改变
    });