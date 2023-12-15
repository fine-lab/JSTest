viewModel.get("btnRefresh") &&
  viewModel.get("btnRefresh").on("customInit", function (data) {
    //刷新--单击
    const data1 = viewModel.getGridModel().getRows();
    cb.utils.alert(data1);
  });