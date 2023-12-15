viewModel.get("rc_contract_sale_1598247344797122568") &&
  viewModel.get("rc_contract_sale_1598247344797122568").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    let grid = viewModel.get("rc_contract_sale_1598247344797122568"); //表格
    grid.clear();
    cb.rest.invokeFunction("rc_voucher.backOpenApiFunction.queryDataByYonQL", { field: "*", param: "", domain: "sact", tbName: "sact.contract.SalesContract" }, function (err, res) {
      var result = res.response;
      debugger;
      for (var i = 0; i < result.length; i++) {
        grid.appendRow(result[i]);
      }
    });
  });