viewModel.on("afterMount", function (data) {
  // 物业维修--页面初始化
  cb.loader.runCommandLine(
    "bill",
    {
      billtype: "voucher",
      billno: "06dd3149",
      params: { mode: "add" }
    },
    viewModel
  );
});
viewModel.on("customInit", function (data) {
  // 物业维修--页面初始化
});