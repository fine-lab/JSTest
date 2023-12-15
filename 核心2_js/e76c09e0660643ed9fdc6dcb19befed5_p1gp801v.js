viewModel.on("customInit", function (data) {
  // 分支测试页面详情--页面初始化
});
viewModel.get("one") &&
  viewModel.get("one").on("afterValueChange", function (data) {
    const v1 = viewModel.get("one").getValue();
    const v2 = viewModel.get("two").getValue();
    if (v2 / 2 < v1) {
      alert("多出来了");
    }
  });