viewModel.get("button22ze") &&
  viewModel.get("button22ze").on("click", function (data) {
    // 计算商品库存表--单击
    cb.rest.invokeFunction("AT1808958A17680009.jxcycyth.spkcb", {}, function (err, res) {});
  });
viewModel.on("customInit", function (data) {
  // 商品库存表_001--页面初始化
});