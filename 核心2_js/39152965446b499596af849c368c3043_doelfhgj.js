viewModel.get("WmsAsnDetV2List") &&
  viewModel.get("WmsAsnDetV2List").on("afterSetDataSource", function (data) {
    // 表格-入库单货物明细V2--设置数据源后
  });
viewModel.get("wareId_name") &&
  viewModel.get("wareId_name").on("afterValueChange", function (data) {
    // 仓库--值改变后
    var gridModel = viewModel.getGridModel();
    gridModel.setColumnValue("zoneId", "");
    gridModel.setColumnValue("zoneId_name", "");
    gridModel.setColumnValue("locId", "");
    gridModel.setColumnValue("locId_code", "");
  });