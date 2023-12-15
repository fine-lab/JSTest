viewModel.on("customInit", function (data) {
  // 修改数量详情--页面初始化
});
viewModel.on("afterLoadData", function () {
  // 获取查询区模型
  let index = viewModel.getParams().index;
  let rowData = viewModel.getParams().rowData;
  viewModel.get("item6pd").setValue(rowData.subQty);
  viewModel.get("item13ih").setValue(rowData._productId_name);
});