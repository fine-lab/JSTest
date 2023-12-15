viewModel.on("customInit", function (data) {
  viewModel.getGridModel().setState("dataSourceMode", "local");
});
viewModel.get("merchant_1624382401313505288") &&
  viewModel.get("merchant_1624382401313505288").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    console.log(data);
    data[0] = { name: "xxxxxxxxxxxxxx" };
  });
viewModel.get("merchant_1624382401313505288") &&
  viewModel.get("merchant_1624382401313505288").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
  });