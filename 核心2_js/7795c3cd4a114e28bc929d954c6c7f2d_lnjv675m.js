viewModel.on("customInit", function (data) {
  // 我的服务详情--页面初始化
});
viewModel.get("test_OrderServiceDetailsList") &&
  viewModel.get("test_OrderServiceDetailsList").on("afterCellValueChange", function (data) {
    // 表格-test订购服务项目订单详情--单元格值改变后
  });
viewModel.get("test_OrderServiceUseOrgList") &&
  viewModel.get("test_OrderServiceUseOrgList").on("afterCellValueChange", function (data) {
    let servicename = viewModel.get("test_GxyService_name").getValue();
    let service = viewModel.get("test_GxyService").getValue();
    let gridModel = viewModel.getGridModel("test_OrderServiceUseOrgList");
    // 表格-test订购服务使用组织--单元格值改变后
    let items = ["Userquantity", "UsedUserquantity", "Orgquantity", "UsedOrgquantity", "test_GxyService_name", "UnusedUserquantity"];
    let rows = gridModel.getRows();
    let row = rows[data.rowIndex];
    switch (data.cellName) {
      case "UseOrg_name":
        if (!row["test_GxyService_name"]) {
          gridModel.setCellValue(data.rowIndex, "test_GxyService", service);
          gridModel.setCellValue(data.rowIndex, "test_GxyService_name", servicename);
        }
        if (!row["Userquantity"]) {
          gridModel.setCellValue(data.rowIndex, "Userquantity", 1);
        }
        if (!row["Orgquantity"]) {
          gridModel.setCellValue(data.rowIndex, "Orgquantity", 1);
        }
        gridModel.setCellValue(data.rowIndex, "UnusedUserquantity", 1);
        gridModel.setCellValue(data.rowIndex, "UsedUserquantity", 0);
        gridModel.setCellValue(data.rowIndex, "UsedOrgquantity", 0);
        gridModel.setCellValue(data.rowIndex, "CloseFlag", 0);
        break;
    }
  });
viewModel.get("test_OrderServiceUseOrgList") &&
  viewModel.get("test_OrderServiceUseOrgList").on("afterSetDataSource", function (data) {
    // 表格-test订购服务使用组织--设置数据源后
    let gridModel = viewModel.getGridModel("test_OrderServiceUseOrgList");
    let gridData = gridModel.getData();
    let gridDataLength = gridData.length;
    if (gridDataLength > 0) {
      for (let i = 0; i < gridDataLength; i++) {
        gridModel.setCellState(i, "UseOrg_name", "readOnly", true);
      }
    }
  });