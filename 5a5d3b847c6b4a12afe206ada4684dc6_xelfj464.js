viewModel.on("customInit", function (data) {});
var gridModel = viewModel.getGridModel(); //获取表格模型
viewModel.get("button13yg") &&
  viewModel.get("button13yg").on("click", function (data) {
    // 增行--单击
    gridModel.appendRow({});
  });
viewModel.get("button19af") &&
  viewModel.get("button19af").on("click", function (data) {
    // 删行--单击
    gridModel.deleteRows([data.index]);
  });
viewModel.get("button18zc") &&
  viewModel.get("button18zc").on("click", function (data) {
    // 插入行--单击
    gridModel.insertRow(data.index, {});
  });
viewModel.get("button12ye") &&
  viewModel.get("button12ye").on("click", function (data) {
    // 批改--单击
  });
viewModel.get("button14yi") &&
  viewModel.get("button14yi").on("click", function (data) {
    // 删行--单击
    let rowIndexes = gridModel.getSelectedRowIndexes();
    gridModel.deleteRows(rowIndexes);
  });
viewModel.get("button17zg") &&
  viewModel.get("button17zg").on("click", function (data) {
    // 复制行--单击
    let copyRow = gridModel.getRow(data.index);
    gridModel.appendRow(copyRow);
  });