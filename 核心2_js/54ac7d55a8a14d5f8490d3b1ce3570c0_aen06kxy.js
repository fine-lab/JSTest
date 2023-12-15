viewModel.get("button22wf") &&
  viewModel.get("button22wf").on("click", function (data) {
    // 按钮--单击
    let grid = viewModel.getGridModel();
    console.log(grid.getRows());
    console.log(grid.getData());
    console.log(grid.getSelectedRowIndexes());
  });