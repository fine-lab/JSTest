viewModel.on("customInit", function (data) {
  // 分包合同详情--页面初始化
  debugger;
});
viewModel.getGridModel().on("afterInsertRow", (args) => {
  debugger;
  // 获取当前行号
  let index = args.index;
  viewModel.getGridModel().setCellValue(index, "productionWorkNumber", null, true);
});