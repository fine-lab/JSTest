viewModel.get("st_othoutrecordlist") &&
  viewModel.get("st_othoutrecordlist").on("beforeSetDataSource", function (data) {
    // 其他出库单列表区域--设置数据源前
    debugger;
    //获得GridModel中的全部数据
    let gridModel = viewModel.getGridModel();
    let data1 = gridModel.getData();
  });