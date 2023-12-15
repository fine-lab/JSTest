viewModel.on("customInit", function (data) {
  // 采购合同--页面初始化
});
viewModel.get("item613nb") &&
  viewModel.get("item613nb").on("afterValueChange", function (data) {
    // 采购方式--值改变后
    debugger;
  });
viewModel.get("item3265ph") &&
  viewModel.get("item3265ph").on("afterValueChange", function (data) {
    // 采购细分方式--值改变后
    debugger;
  });