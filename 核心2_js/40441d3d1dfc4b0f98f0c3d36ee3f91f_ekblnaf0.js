viewModel.get("button50fe") &&
  viewModel.get("button50fe").on("click", function (data) {
    // 按钮--单击
    var data = {
      billtype: "VoucherList", // 单据类型
      billno: "pu_applyorderlist", // 单据号
      domainKey: "upu"
    };
    cb.loader.runCommandLine("bill", data, viewModel);
  });