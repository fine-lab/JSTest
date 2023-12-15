viewModel.on("customInit", function (data) {
  // 测试定时任务--页面初始化
  cb.rest.invokeFunction("e1675d0a35c44574b544ebb764ec2f45", {}, function (err, res) {
    console.log(11111111, res);
    console.log(22222222, err);
  });
});