viewModel.get("name") &&
  viewModel.get("name").on("beforeValueChange", function (data) {
    // 姓名--值改变前
  });
viewModel.on("customInit", function (data) {
  // 人员信息详情--页面初始化
});