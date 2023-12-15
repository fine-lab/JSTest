viewModel.on("afterProcessWorkflow", function () {
  if (viewModel.getParams().mode != "browse") {
    viewModel.get("btnAddRow").setVisible(true);
  }
});
viewModel.get("button141gc") &&
  viewModel.get("button141gc").on("click", function (data) {
    // 按钮--单击
  });