viewModel.on("customInit", function (data) {
  // 工作移交列表--页面初始化
  viewModel.getGridModel().setPageSize(5000);
});