viewModel.on("customInit", function (data) {
  // 销售出库单--页面初始化
});
//编辑
viewModel.on("beforeEdit", function (data) {
  console.log("[beforeEdit]");
  cb.utils.alert("单据锁定, 不允许操作!");
  return false;
});
//编辑
viewModel.on("beforeDelete", function (data) {
  console.log("[beforeDelete]");
  cb.utils.alert("单据锁定, 不允许操作!");
  return false;
});
viewModel.get("button74ki") &&
  viewModel.get("button74ki").on("click", function (data) {
    // 确认出库--单击
  });