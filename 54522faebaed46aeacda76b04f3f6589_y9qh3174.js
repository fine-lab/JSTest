viewModel.get("button22fd") &&
  viewModel.get("button22fd").on("click", function (data) {
    // 计算进销存数量月报表--单击
    cb.rest.invokeFunction("AT1808958A17680009.jxcycyth.slyb", {}, function (err, res) {});
  });
viewModel.on("customInit", function (data) {
  // 进销存数量月报表_001--页面初始化
});