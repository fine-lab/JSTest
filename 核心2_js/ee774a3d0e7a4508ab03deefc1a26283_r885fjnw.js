viewModel.on("customInit", function (data) {
  // 付款申请单详情--页面初始化
  cb.rest.invokeFunction("AT164E137409380003.APIfunction.testopenapi", {}, function (err, res) {
    console.log(res);
  });
});