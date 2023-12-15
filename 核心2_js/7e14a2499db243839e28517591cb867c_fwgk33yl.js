viewModel.on("customInit", function (data) {
  //日志测试111--页面初始化
  debugger;
  const gridModel = viewModel.get(pageParameter.gridModel); // 获取到一个gridModel
  const gridModelData = gridModel.getAllData(); // 调用getAllData方法获取它的全部数据。
});