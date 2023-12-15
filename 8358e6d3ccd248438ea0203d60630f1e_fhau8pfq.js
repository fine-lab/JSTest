viewModel.on("customInit", function (data) {
  // 投诉建议电子流--页面初始化
  cb.loader.runCommandLine(
    "bill",
    {
      billtype: "Voucher",
      billno: "704eb9c4",
      params: {
        mode: "add"
      }
    },
    viewModel
  );
});