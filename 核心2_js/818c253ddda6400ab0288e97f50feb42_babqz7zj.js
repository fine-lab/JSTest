viewModel.get("button57sd") &&
  viewModel.get("button57sd").on("click", function (data) {
    // 按钮--单击
  });
viewModel.on("customInit", function (data) {
  viewModel.on("afterMount", function () {
    viewModel.get("name").setVisible(false);
    viewModel.get("start_time").setVisible(true);
  });
  if ("add" == viewModel.getParams().mode) {
    var gridModel = viewModel.get("learning_learner1List");
    gridModel.setColumnState("user_id", "bHidden", "true");
  }
});