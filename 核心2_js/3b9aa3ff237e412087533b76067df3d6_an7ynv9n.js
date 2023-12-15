viewModel.on("afterSearch", function (args) {
  var meiju = viewModel.get("expsettleinfos").getEditRowModel().get("igathertype");
  let data = meiju.__data.dataSource;
  debugger;
  // 过滤不需要展示的数据
});