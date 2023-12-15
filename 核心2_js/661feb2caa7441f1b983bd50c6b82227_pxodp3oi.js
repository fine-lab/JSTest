viewModel.get("button25dh") &&
  viewModel.get("button25dh").on("click", function (data) {
    // 拉取潜在客户--单击
    let obj = cb.loader.runCommandLine(
      "bill",
      {
        billtype: "VoucherList",
        billno: "5d2e5a6f", //5fed5e53
        domainKey: "yourKeyHere",
        params: { mode: "browse" }
      },
      viewModel
    );
  });
viewModel.get("btnDelete") &&
  viewModel.get("btnDelete").on("click", function (data) {
    let idx = data.index;
    let rows = viewModel.getGridModel().getRows();
    let rowData = rows[idx];
    rowData.idx = idx;
    cb.rest.invokeFunction("GZTBDM.serviceApiFunc.clrRelateCustApi", { data: [rowData] }, function (err, res) {});
  });
viewModel.get("btnBatchDelete") &&
  viewModel.get("btnBatchDelete").on("click", function (data) {
    let dataRows = viewModel.getGridModel().getSelectedRows();
    cb.rest.invokeFunction("GZTBDM.serviceApiFunc.clrRelateCustApi", { data: dataRows }, function (err, res) {});
  });