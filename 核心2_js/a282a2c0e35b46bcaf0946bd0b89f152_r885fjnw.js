viewModel.on("customInit", function (data) {
  // 收款合同详情--页面初始化
  cb.rest.invokeFunction("AT15E2412609680009.frontDesignerFunction.getUserId", {}, function (err, res) {
    console.log(err);
    console.log(res);
  });
});