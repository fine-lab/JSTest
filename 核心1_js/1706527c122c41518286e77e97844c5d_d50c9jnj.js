viewModel.on("beforeInit", function (args) {
  // 修改按钮颜色
});
viewModel.get("button32mh").on("click", function (args) {
  // 取消按钮
  viewModel.communication({ type: "return" });
});