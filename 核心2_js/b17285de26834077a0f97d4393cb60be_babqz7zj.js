viewModel.get("learning_learner1List") &&
  viewModel.get("learning_learner1List").on("afterCellValueChange", function (data) {
    // 表格-学员范围1--单元格值改变后
  });
viewModel.get("learning_learner1List") &&
  viewModel.get("learning_learner1List").on("afterSelect", function (data) {
    // 表格-学员范围1--选择后
    console.log("afterSelect", data);
  });