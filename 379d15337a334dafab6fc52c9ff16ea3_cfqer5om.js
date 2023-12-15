viewModel.get("button15cf") &&
  viewModel.get("button15cf").on("click", function (data) {
    // 测试按钮1--单击
    debugger;
    cb.rest.invokeFunction("HRCM.houduancode.test004", {}, function (err, res) {});
  });