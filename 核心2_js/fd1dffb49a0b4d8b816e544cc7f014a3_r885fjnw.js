viewModel.on("customInit", function (data) {
  // 简易销售订单详情--页面初始化
  cb.rest.invokeFunction("5ebef12bb8f64694b29870fb5a1ca06f", {}, function (err, res) {
    console.log(res);
    console.log(err);
  });
});