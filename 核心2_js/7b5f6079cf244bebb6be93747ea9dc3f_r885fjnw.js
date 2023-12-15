viewModel.on("customInit", function (data) {
  // 销售发票列表--页面初始化
  // 数据加载后执行
  viewModel.on("afterMount", function () {
    let gridModel = viewModel.getGridModel();
    console.log(gridModel, "123");
    var data = [{ vouchdate: "2023-1-5", exchRate: 5 }];
    gridModel.setDataSource(data);
    const gridModelData = gridModel.getAllData();
    console.log(gridModelData, "444");
    gridModel.updateRow(0, { auditor: "77" });
  });
});