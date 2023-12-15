viewModel.on("customInit", function (data) {
  //仓库--页面初始化
  cb.rest.invokeFunction("AT169C965A08F00009.ApiFunction.test", {}, function (err, res) {
    console.log("res", res);
    console.log("err", err);
  });
});