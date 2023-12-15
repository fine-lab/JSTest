viewModel.on("customInit", function (data) {
  // 测试单据详情--页面初始化
  viewModel.get("cs") &&
    viewModel.get("cs").on("afterValueChange", function (data) {
      // 字段1--值改变后
      // 字段1--值改变后
    });
});