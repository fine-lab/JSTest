viewModel.get("contractNumber_subcontractNo") &&
  viewModel.get("contractNumber_subcontractNo").on("afterValueChange", function (data) {
    // 合同号--值改变后
    //改变后清除所有行
    var gridModel = viewModel.getGridModel();
    var value = data.value;
    var old = data;
    if (value == null) {
      gridModel.deleteAllRows();
    }
    if (old.hasOwnProperty("oldValue")) {
      gridModel.deleteAllRows();
    }
  });