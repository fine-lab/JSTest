viewModel.get("button50qh") &&
  viewModel.get("button50qh").on("click", function (data) {
    // 请购单--单击
    let qgData = {
      billtype: "VoucherList", // 单据类型
      billno: "pu_applyorderlist", // 单据号
      domainKey: "upu",
      params: {
        mode: "add" // (编辑态edit、新增态add、)
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", qgData, viewModel);
  });
viewModel.get("button93dh") &&
  viewModel.get("button93dh").on("click", function (data) {
    // 采购入库--单击
    let qgData = {
      billtype: "VoucherList", // 单据类型
      billno: "st_purinrecordlist", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add" // (编辑态edit、新增态add、)
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", qgData, viewModel);
  });