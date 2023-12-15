viewModel.on("customInit", function (data) {
  // 公务用车--新1--页面初始化
  cb.loader.runCommandLine(
    "bill",
    {
      billtype: "voucher",
      billno: "593f28df",
      params: { mode: "add" }
    },
    viewModel
  );
});