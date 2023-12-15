viewModel.get("merchant_1648730656803389449") &&
  viewModel.get("merchant_1648730656803389449").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    console.log("ok");
  });
viewModel.on("customInit", function (data) {
  console.log("customInit----------------------");
  console.log(data);
});
viewModel.get("button24fc") &&
  viewModel.get("button24fc").on("click", function (data) {
    // 按钮--单击
    viewModel.getGridModel().setState("dataSourceMode", "local");
    viewModel.getGridModel().setDataSource([{}]);
  });