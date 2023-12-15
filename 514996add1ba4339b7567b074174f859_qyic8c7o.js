viewModel.on("customInit", function (data) {
  // 商机跨BG报备确认单--页面初始化
});
viewModel.on("beforeSearch", function (data) {
  // 商机跨BG报备确认单--页面初始化
  cb.rest.invokeFunction("AT177016BE17B80006.apiFunction.getOpptList", {}, function (err, res) {
    debugger;
    const gridModel = viewModel.getGridModel();
    gridModel._set_data("dataSourceMode", "local");
    gridModel.setData(res.res);
    console.log(res);
  });
});
viewModel.get("opptinterfiling_1688910780467511297") &&
  viewModel.get("opptinterfiling_1688910780467511297").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
  });
viewModel.get("opptinterfiling_1688910780467511297") &&
  viewModel.get("opptinterfiling_1688910780467511297").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
  });