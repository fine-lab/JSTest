viewModel.on("customInit", function (data) {
  // 商机报备列表--页面初始化
  viewModel.get("NewlyAdded")?.setVisible(false);
  viewModel.get("btnaddfixed")?.setVisible(false);
});