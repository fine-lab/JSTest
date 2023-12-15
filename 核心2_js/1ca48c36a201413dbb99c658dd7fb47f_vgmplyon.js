viewModel.get("button24oj") &&
  viewModel.get("button24oj").on("click", function (data) {
    // 派发额度--单击
    debugger;
    let data2 = {
      billtype: "Voucher", // 单据类型
      billno: "5ccb8ec0", // 单据号
      params: {
        mode: "add" // 仅传mode即可
      }
    };
    cb.loader.runCommandLine("bill", data2, viewModel);
  });
viewModel.get("btnExportDetail") &&
  viewModel.get("btnExportDetail").on("click", function (data) {
    debugger;
  });