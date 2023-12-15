var gridModel = viewModel.getGridModel(); //获取表格模型
viewModel.get("button30yg") &&
  viewModel.get("button30yg").on("click", function (data) {
    // 增行--单击
    gridModel.appendRow({});
  });
viewModel.get("button42bj") &&
  viewModel.get("button42bj").on("click", function (data) {
    // 删行--单击
    let rowIndexes = gridModel.getSelectedRowIndexes();
    gridModel.deleteRows(rowIndexes);
  });
viewModel.get("button114wf") &&
  viewModel.get("button114wf").on("click", function (data) {
    // 删行--单击
    gridModel.deleteRows([data.index]);
  });
viewModel.get("button89ai") &&
  viewModel.get("button89ai").on("click", function (data) {
    // 插入行--单击
    gridModel.insertRow(data.index, {});
  });
viewModel.get("button65md") &&
  viewModel.get("button65md").on("click", function (data) {
    // 复制行--单击
    let copyRow = gridModel.getRow(data.index);
    gridModel.appendRow(copyRow);
  });