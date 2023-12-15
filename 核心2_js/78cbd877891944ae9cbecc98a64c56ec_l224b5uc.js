viewModel.on("customInit", function (data) {
  // 潜在客户--页面初始化
  viewModel.get("customerClass_Name")?.on("afterValueChange", function (args) {
    let customerClass = viewModel.get("customerClass")?.getValue();
    if (customerClass) {
      data.repeatFn();
    }
  });
});