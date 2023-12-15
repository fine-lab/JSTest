viewModel.get("TaskorderdetailsList") &&
  viewModel.get("TaskorderdetailsList").getEditRowModel() &&
  viewModel.get("TaskorderdetailsList").getEditRowModel().get("shengchangonghao.Productionworknumber") &&
  viewModel
    .get("TaskorderdetailsList")
    .getEditRowModel()
    .get("shengchangonghao.Productionworknumber")
    .on("valueChange", function (data) {
      // 生产工号--值改变
    });
viewModel.get("hetonghao_id") &&
  viewModel.get("hetonghao_id").on("afterValueChange", function (data) {
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