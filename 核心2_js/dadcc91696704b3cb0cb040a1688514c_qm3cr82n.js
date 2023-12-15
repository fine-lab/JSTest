viewModel.on("customInit", function (data) {
  // 课程卡片--页面初始化
  cb.rest.invokeFunction("GT8566AT282.rule.getPlanList", {}, function (err, res) {
    console.log(err, res);
    debugger;
  });
});