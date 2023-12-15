viewModel.on("customInit", function (data) {
  // 采购合同--页面初始化
  cb.rest.invokeFunction("AT168516D809980006.backOpenApiFunction.test0202", {}, function (err, res) {
    console.log(err);
    console.log(res);
  });
});