viewModel.on("customInit", function (data) {
  // 测试附件组件详情--页面初始化
});
viewModel.get("name") &&
  viewModel.get("name").on("afterValueChange", function (data) {
    // 名称--值改变后
    viewModel.get("number").setValue(999);
  });