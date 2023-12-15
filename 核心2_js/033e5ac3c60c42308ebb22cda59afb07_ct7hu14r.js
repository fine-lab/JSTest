viewModel.on("customInit", function (data) {
  // 采购入库单列表--页面初始化
});
//编辑
viewModel.on("beforeEdit", function (data) {
  console.log("[beforeEdit]");
  cb.utils.alert("单据锁定, 不允许操作!");
  return false;
});
//编辑
viewModel.on("beforeBatchdelete", function (data) {
  console.log("[beforeBatchdelete]");
  cb.utils.alert("单据锁定, 不允许操作!");
  return false;
});