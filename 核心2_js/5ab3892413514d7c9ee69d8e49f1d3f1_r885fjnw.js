viewModel.on("customInit", function (data) {
  console.log("111111111111111111111");
  //测试聚合--页面初始化
  cb.rest.invokeFunction("AT183D470E09480002.backWorkflowFunction.qweqwe", {}, function (err, res) {
    console.log("res", resresresresresres);
  });
});