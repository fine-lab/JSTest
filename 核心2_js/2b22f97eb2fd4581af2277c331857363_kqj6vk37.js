viewModel.get("button73ij") &&
  viewModel.get("button73ij").on("click", function (data) {
    // 复制行--单击
    var gridModel = viewModel.get("competitorList");
    var datas = gridModel.getRow(data.index);
    gridModel.appendRow(datas);
    gridModel.setState("mergeCells", true);
    gridModel.setColumnState("groupNumber", "bMergeCol", true);
  });