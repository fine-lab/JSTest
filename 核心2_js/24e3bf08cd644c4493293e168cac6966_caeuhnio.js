viewModel.on("customInit", function (data) {
  // 测试人员--页面初始化
  cb.rest.invokeFunction("AT169D355408F00002.testKAIFAAPI.getRole", {}, function (err, res) {
    console.log("AT169D355408F00002.testKAIFAAPI.getRole res===========================>" + res);
    console.log("AT169D355408F00002.testKAIFAAPI.getRole err===========================>" + err);
  });
});