viewModel.on("customInit", function (data) {
  // 采购验收结算单详情--页面初始化
});
viewModel.on("afterLoadData", function (data) {
  viewModel.get("yanshoudanmoban").setValue("cc269190-3d6e-11ed-8a2a-dbbac9348c51");
});