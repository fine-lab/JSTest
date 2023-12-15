viewModel.on("customInit", function (data) {
  // 港口信息--页面初始化
});
viewModel.get("button16ia") &&
  viewModel.get("button16ia").on("click", function (data) {
    // 按钮--单击
    viewModel.getGridModel().clear();
  });