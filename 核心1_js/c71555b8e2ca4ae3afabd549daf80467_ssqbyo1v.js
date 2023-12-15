viewModel.on("customInit", function (data) {
  //函数0602详情--页面初始化
  cb.rest.invokeFunction("GT0000TEN0.aaa.apitest", {}, function (err, res) {
    alert(res.s);
  });
});