viewModel.get("button24nc") &&
  viewModel.get("button24nc").on("click", function (data) {
    // 按钮--单击
    //打开平面图单据
    data = {
      billtype: "Voucher", // 单据类型
      billno: "9242e7a0", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "add" // (编辑态edit、新增态add、浏览态browse),
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data, viewModel);
  });