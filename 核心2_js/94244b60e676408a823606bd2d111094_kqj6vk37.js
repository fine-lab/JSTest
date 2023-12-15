viewModel.on("customInit", function (data) {
  // 商机列表--页面初始化
  viewModel.get("newlyAdded")?.setVisible(false);
  viewModel.get("NewlyAdded")?.setVisible(false);
});