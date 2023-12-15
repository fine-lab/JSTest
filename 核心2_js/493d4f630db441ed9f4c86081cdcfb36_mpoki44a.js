viewModel.get("huibaoshijian") &&
  viewModel.get("huibaoshijian").on("afterValueChange", function (data) {
    // 汇报时间--值改变后
    let gridModel = viewModel.getGridModel("zhoubaogongshi1List");
    if (gridModel.getRowsCount() > 0) {
    } else {
      let row = gridModel.appendRow();
    }
    let nowdate = viewModel.get("huibaoshijian").getValue();
    gridModel.setColumnValue("riqi", nowdate);
    debugger;
    cb.rest.invokeFunction("7dac0d3ca2de447f82ef599f384144a6", { querydate: nowdate }, function (err, res) {
      gridModel.setColumnValue("ziduan1", res.weather);
    });
  });