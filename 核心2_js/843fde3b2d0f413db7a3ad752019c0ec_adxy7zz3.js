viewModel.on("customInit", function (data) {
  // 函数test202301121658详情--页面初始化
  cb.rest.invokeFunction("AT16AFEBC409A0000A.firstlevel.wefwefw", {}, function (err, res) {
    alert("test");
  });
});