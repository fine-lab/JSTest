viewModel.on("afterMount", function () {
  //  表格列受领域的代码控制，所有没显示出来
  // 在这里通过代码  将字段列 显示出来
  viewModel.get("adjustDetails").setColumnState("productId_name", "visible", true);
});