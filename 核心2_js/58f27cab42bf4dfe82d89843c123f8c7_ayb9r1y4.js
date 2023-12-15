viewModel.get("contractNumber_id") &&
  viewModel.get("contractNumber_id").on("afterValueChange", function (data) {
    // 合同号--值改变后
    var viewModel = this;
    // 改变后清除所有行
    var gridModel = viewModel.getGridModel();
    var value = event.params.value;
    var old = event.params;
    if (value == null) {
      gridModel.deleteAllRows();
    }
    if (old.hasOwnProperty("oldValue")) {
      gridModel.deleteAllRows();
    }
  });