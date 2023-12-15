viewModel.on("customInit", function (data) {
  // 设备记录列表--页面初始化
  viewModel.on("afterMount", function () {
    viewModel.getCache("FilterViewModel").getParams().filterRows = 3;
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      console.log(filtervm);
    });
  });
});