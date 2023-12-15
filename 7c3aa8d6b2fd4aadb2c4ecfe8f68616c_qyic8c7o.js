viewModel.get("button20zd") &&
  viewModel.get("button20zd").on("click", function (data) {
    // 写入实体--单击
    const time = viewModel.getCache("FilterViewModel").getData().scrmSearchDatetime;
    debugger;
    cb.rest.invokeFunction("GT1913AT11.WXRYFP.getRecordInfo", { startTime: time.value1, endTime: time.value2 }, function (err, res) {
      debugger;
      var gridModel = viewModel.getGridModel();
      gridModel.setState("dataSourceMode", "local");
      gridModel.setDataSource(res.resTest);
    });
  });
viewModel.on("customInit", function (data) {
});