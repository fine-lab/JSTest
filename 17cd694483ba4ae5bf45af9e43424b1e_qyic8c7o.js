viewModel.get("button18vb") &&
  viewModel.get("button18vb").on("click", function (data) {
    // 导入实体--单击
    cb.rest.invokeFunction("GT1913AT11.WXRYFP.getDailyReport", {}, function (err, res) {
      debugger;
      var gridModel = viewModel.getGridModel();
      gridModel.setState("dataSourceMode", "local");
      gridModel.setDataSource(res.resTest);
    });
  });
viewModel.get("button23ki") &&
  viewModel.get("button23ki").on("click", function (data) {
    // 删除实体数据--单击
    cb.rest.invokeFunction("GT1913AT11.WXRYFP.delDailyReport", {}, function (err, res) {
      debugger;
    });
  });