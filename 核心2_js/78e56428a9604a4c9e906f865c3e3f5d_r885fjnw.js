viewModel.on("customInit", function (data) {
  // 测试定时任务详情--页面初始化
  cb.rest.invokeFunction("2389197b0ccd4e8482e45dfc11489962", {}, function (err, res) {
    console.log(err);
    console.log(res);
  });
});