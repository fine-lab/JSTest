viewModel.get("yewuleixingquzhi") &&
  viewModel.get("yewuleixingquzhi").on("beforeValueChange", function (data) {
    // 业务类型取值--值改变前
  });
viewModel.get("YWLX") &&
  viewModel.get("YWLX").on("afterValueChange", function (data) {
    // 业务类型--值改变后
  });
viewModel.get("YWLX") && viewModel.get("YWLX").on("afterSelect", function (data) {});
viewModel.get("button2670939fe") &&
  viewModel.get("button2670939fe").on("click", function (data) {
    // 按钮--单击
  });