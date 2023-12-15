viewModel.on("customInit", function (data) {
  // 员工cm--页面初始化
});
viewModel.get("testpsn_1628838301023076360") &&
  viewModel.get("testpsn_1628838301023076360").on("afterSelect", function (data) {
    // 表格--选择后
    debugger;
    var psncode = viewModel.getGridModel().getCellValue(data, "psncode");
    const dataAll = viewModel.getGridModel().getAllData();
    cb.utils.alert(JSON.stringify(dataAll));
  });