viewModel.get("wareId_name") &&
  viewModel.get("wareId_name").on("afterValueChange", function (data) {
    // 仓库--值改变后
    viewModel.get("name").setValue(""); //库区名称
    viewModel.get("paLocCode").setValue(""); //上架过度库位
    viewModel.get("paLocId_code").setValue("");
    viewModel.get("pkLocCode").setValue(""); //拣货过度库位
    viewModel.get("pkLocId_code").setValue("");
    viewModel.get("replenish").setValue(""); //拣货位设置
  });