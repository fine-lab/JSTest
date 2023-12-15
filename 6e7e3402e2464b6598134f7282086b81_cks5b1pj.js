var gridModel = viewModel.getGridModel("table20da");
viewModel.on("beforeSearch", function (args) {
  gridModel = viewModel.getGridModel("table20da"); //获取表格模型
});
viewModel.get("button16da") &&
  viewModel.get("button16da").on("click", function (data) {
    // 增行--单击
    gridModel.appendRow({});
  });
viewModel.get("button17dd") &&
  viewModel.get("button17dd").on("click", function (data) {
    // 删行--单击
    let rowIndexes = gridModel.getSelectedRowIndexes();
    gridModel.deleteRows(rowIndexes);
  });
viewModel.get("button20ee") &&
  viewModel.get("button20ee").on("click", function (data) {
    // 复制行--单击
    let copyRow = gridModel.getRow(data.index);
    gridModel.appendRow(copyRow);
  });
viewModel.get("button21eg") &&
  viewModel.get("button21eg").on("click", function (data) {
    // 插入行--单击
    gridModel.insertRow(data.index, {});
  });
viewModel.get("button22ee") &&
  viewModel.get("button22ee").on("click", function (data) {
    // 删行--单击
    gridModel.deleteRows([data.index]);
  });