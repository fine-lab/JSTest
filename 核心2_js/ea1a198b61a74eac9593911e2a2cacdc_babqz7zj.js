viewModel.get("button30kd") &&
  viewModel.get("button30kd").on("click", function (data) {
    // 自建跳自建--单击
    let tiaozhuan = {
      billtype: "VoucherList", // 单据类型
      billno: "b733a54bList" // 单据号
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", tiaozhuan, viewModel);
  });