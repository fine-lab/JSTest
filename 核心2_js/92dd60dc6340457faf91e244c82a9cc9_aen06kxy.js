viewModel.on("afterLoadData", function (data) {
  // 测试1详情--页面初始化
  debugger;
  if (viewModel.getParams().mode == "add") {
    var girdModel = viewModel.getGridModel();
    girdModel.appendRow({});
    girdModel.appendRow({});
  }
});