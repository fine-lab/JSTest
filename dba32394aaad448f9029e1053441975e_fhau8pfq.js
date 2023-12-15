viewModel.getGridModel().on("afterSetDataSource", function () {
  viewModel.get("btnBatchSubmitDrop").setVisible(false);
});
viewModel.getGridModel().on("beforeSetActionsState", function (args) {
  args.forEach(function (item) {
    item.btnSubmit.visible = false;
  });
});
viewModel.enableFeature("voucherNoReturn");
viewModel.on("customInit", function (data) {
  // 差旅费报销单列表--页面初始化
});