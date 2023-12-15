viewModel.get("button24id") &&
  viewModel.get("button24id").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("GT8429AT6.backOpenApiFunction.testQuery", {}, function (err, res) {
      console.log(res);
    });
  });
viewModel.get("button31gi") &&
  viewModel.get("button31gi").on("click", function (data) {
    // 按钮--单击
    var rowData = viewModel.getGridModel().getSelectedRows();
    let request = {
      billtype: "Voucher", // 单据类型
      billno: "arap_paybill", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add", // (编辑态edit、新增态add、浏览态browse),
        perData: rowData //客户退款信息
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", request, viewModel);
  });