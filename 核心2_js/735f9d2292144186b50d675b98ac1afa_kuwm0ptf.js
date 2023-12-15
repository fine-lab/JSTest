viewModel.on("customInit", function (data) {
  // 标准工时日期维护--页面初始化
  console.log("页面初始化完成后");
});
viewModel.get("gs_date_1655502995595460610") &&
  viewModel.get("gs_date_1655502995595460610").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    console.log("========设置数据源后=========>" + data);
  });
viewModel.get("gs_date_1655502995595460610") &&
  viewModel.get("gs_date_1655502995595460610").on("beforeSetDataSource", function (data) {
    debugger;
    // 表格--设置数据源前
    console.log("=======设置数据源前==========>" + data);
  });