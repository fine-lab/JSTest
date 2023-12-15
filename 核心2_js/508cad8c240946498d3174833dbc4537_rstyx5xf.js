viewModel.get("button13ld") &&
  viewModel.get("button13ld").on("click", function (data) {
    // 增行--单击
    var gridModel = viewModel.get("treech_testList");
    gridModel.appendRow({});
  });
viewModel.get("button16qi") &&
  viewModel.get("button16qi").on("click", function (data) {
    // 删行--单击
    var gridModel = viewModel.get("treech_testList");
    gridModel.deleteRows([date.index]);
  });