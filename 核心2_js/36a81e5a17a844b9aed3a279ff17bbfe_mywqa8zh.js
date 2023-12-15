viewModel.on("customInit", function (data) {
  // 测试主子_app详情--页面初始化
  viewModel.on("afterLoadData", function () {
    viewModel.get("new2").setValue("22222");
  });
});