viewModel.on("customInit", function (data) {
  viewModel.get("btnAdd").setVisible(true);
});
viewModel.get("button24ea") &&
  viewModel.get("button24ea").on("click", function (data) {
    // 潜在客户转化--单击
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
    let res = cb.rest.invokeFunction("GZTBDM.serviceApiFunc.clrRelateCustApi", { data: [rowData] }, function (err, res) {});
    console.log(res);
  });
viewModel.get("btnBatchDelete") &&
  viewModel.get("btnBatchDelete").on("click", function (data) {
    let dataRows = viewModel.getGridModel().getSelectedRows();
    cb.rest.invokeFunction("GZTBDM.serviceApiFunc.clrRelateCustApi", { data: dataRows }, function (err, res) {});
  });
viewModel.get("button28ee") &&
  viewModel.get("button28ee").on("click", function (data) {
    // 建机事业部--单击
    let billNo = "ec9c561f";
    let obj = cb.loader.runCommandLine(
      "bill",
      {
        billtype: "VoucherList",
        billno: billNo,
        domainKey: "yourKeyHere",
        params: { mode: "browse" }
      },
      viewModel
    );
  });
viewModel.get("button37fb") &&
  viewModel.get("button37fb").on("click", function (data) {
    // 环保事业部--单击
    let billNo = "03fc9fc4";
    let obj = cb.loader.runCommandLine(
      "bill",
      {
        billtype: "VoucherList",
        billno: billNo,
        domainKey: "yourKeyHere",
        params: { mode: "browse" }
      },
      viewModel
    );
  });
viewModel.get("button47de") &&
  viewModel.get("button47de").on("click", function (data) {
    // 游乐事业部--单击
    let billNo = "5373f6ad";
    let obj = cb.loader.runCommandLine(
      "bill",
      {
        billtype: "VoucherList",
        billno: billNo,
        domainKey: "yourKeyHere",
        params: { mode: "browse" }
      },
      viewModel
    );
  });