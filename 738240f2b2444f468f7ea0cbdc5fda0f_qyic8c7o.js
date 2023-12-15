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
viewModel.on("customInit", function (data) {
  // 商机跨BG报备确认单--页面初始化
  debugger;
});