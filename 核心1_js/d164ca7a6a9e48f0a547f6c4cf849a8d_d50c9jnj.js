//点击编辑后,删除按钮隐藏
viewModel.get("btnEdit").on("click", function (data) {
  viewModel.get("btnBatchSave").setVisible(true);
});
viewModel.on("customInit", function (data) {
  viewModel.get("btnBatchSave").setVisible(false);
});
//点击取消后,批量保存按钮隐藏
viewModel.get("btnAbandon").on("click", function (data) {
  viewModel.get("btnBatchSave").setVisible(false);
});