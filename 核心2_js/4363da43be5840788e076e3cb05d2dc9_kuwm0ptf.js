viewModel.get("sorg_name") &&
  viewModel.get("sorg_name").on("beforeValueChange", function (data) {
    // 销售组织--值改变前
  });
viewModel.on("customInit", function (data) {
  // 销售订单lxf详情--页面初始化
});