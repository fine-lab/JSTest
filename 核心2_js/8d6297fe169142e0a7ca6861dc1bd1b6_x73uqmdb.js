viewModel.get("new1").on("afterValueChange", function (data) {
  // 按钮--单击
  viewModel.getGridModel().deleteAllRows();
  viewModel.getGridModel().insertRow(0, { new1: "11", new2: "22" });
  viewModel.getGridModel().insertRow(1, { new1: "11", new2: "22" });
});