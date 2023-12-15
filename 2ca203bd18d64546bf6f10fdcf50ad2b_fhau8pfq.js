viewModel.on("customInit", function (data) {
  // 携物出门--页面初始化
  cb.loader.runCommandLine(
    "bill",
    {
      billtype: "voucher",
      billno: "c18ad669",
      params: { mode: "add" }
    },
    viewModel
  );
});