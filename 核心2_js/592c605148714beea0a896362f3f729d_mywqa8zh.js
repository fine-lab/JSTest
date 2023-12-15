viewModel.get("button13jh") &&
  viewModel.get("button13jh").on("click", function (data) {
    // 增行--单击
    var gridModel = viewModel.get("treechList");
    gridModel.appendRow({});
  });
viewModel.get("button20sg") &&
  viewModel.get("button20sg").on("click", function (data) {
    // 删行--单击
    var gridModel = viewModel.get("treechList");
    //获取行号
    gridModel.deleteRows([data.index]);
  });