viewModel.get("Related1") &&
  viewModel.get("Related1").on("afterValueChange", function (data) {
    // 是否关联合同--值改变后
    viewModel.get("Associateditemnumber1").setVisible("true");
    viewModel.get("Associatedname1").setVisible("true");
    viewModel.get("Relatedcontract1").setVisible("true");
  });
viewModel.get("Associateditemnumber1") &&
  viewModel.get("Associateditemnumber1").on("afterValueChange", function (data) {
    // 关联项目编号--值改变后
  });
viewModel.get("Related1") &&
  viewModel.get("Related1").on("beforeValueChange", function (data) {
    // 是否关联合同--值改变前
  });
viewModel.get("Associateditemnumber1") &&
  viewModel.get("Associateditemnumber1").on("beforeValueChange", function (data) {
    // 关联项目编号--值改变前
  });