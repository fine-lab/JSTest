var gridmodel = viewModel.getGridModel();
gridmodel.on("setTablePageSizeOptions", function (args) {
  //设置pageSizeOptions 对象
  args.pageSizeOptions = ["10", "20", "30", "50", "80", "100", "200", "500", "1000", "2000"];
});