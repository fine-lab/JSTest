viewModel.get("rc_invoice_sale_1599162516410728448") &&
  viewModel.get("rc_invoice_sale_1599162516410728448").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    let grid = viewModel.get("rc_invoice_sale_1599162516410728448"); //表格
    grid.clear();
    cb.rest.invokeFunction("rc_voucher.backOpenApiFunction.queryDataByYonQL", { field: "*", param: "", domain: "udinghuo", tbName: "voucher.invoice.SaleInvoice" }, function (err, res) {
      var result = res.response;
      for (var i = 0; i < result.length; i++) {
        grid.appendRow(result[i]);
      }
    });
  });