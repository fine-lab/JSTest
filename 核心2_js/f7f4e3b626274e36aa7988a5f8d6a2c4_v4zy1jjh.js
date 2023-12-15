viewModel.get("button41sa") &&
  viewModel.get("button41sa").on("click", function (data) {
    // 按钮--单击
    var viewModel = this;
    var data = {
      billtype: "Voucher",
      billno: "st_purinrecord",
      domainKey: "yourKeyHere",
      params: {
        mode: "add"
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data, viewModel);
  });