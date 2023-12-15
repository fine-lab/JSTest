viewModel.on("customInit", function (data) {
  // 学员端--学习计划--页面初始化
});
viewModel.get("button5bh") &&
  viewModel.get("button5bh").on("click", function (data) {
    // 测试学员学习计划列表--单击
    cb.rest.invokeFunction("395137de4d8a4962a366a25cf4abb728", {}, function (err, res) {
      console.log("1111111", err, res);
    });
    cb.rest.invokeFunction("c973d65d89d64725bda708aeb5d20e19", {}, function (err, res) {
      console.log("2222222", err, res);
    });
  });