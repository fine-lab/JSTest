// 页面初始化
viewModel.on("customInit", function (data) {
  viewModel.get("x").setValue("test-x");
  viewModel.get("y").setValue("test-y");
});