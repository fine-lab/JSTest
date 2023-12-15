viewModel.on("customInit", function (data) {
  // 测试页面--页面初始化
  cb.rest.invokeFunction("9543f93e9bc04fa793ed3a23fcbe1593", {}, function (err, res) {
    console.log(res, "resssssssssssssss");
    console.log(err, "errrrrrrrrrrrrrrr");
  });
});