viewModel.on("customInit", function (data) {
  // 潜在客户列表--页面初始化
  viewModel.get("newlyAdded")?.setVisible(false);
  viewModel.get("NewlyAdded")?.setVisible(false);
});