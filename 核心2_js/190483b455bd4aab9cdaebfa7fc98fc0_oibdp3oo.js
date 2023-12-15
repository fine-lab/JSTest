viewModel.on("customInit", function (data) {
  // 物料创建--页面初始化
  viewModel.on("afterLoadData", function (event) {
    debugger;
  });
  viewModel.get("childs") &&
    viewModel.get("childs").getEditRowModel() &&
    viewModel.get("childs").getEditRowModel().get("productId.code") &&
    viewModel
      .get("childs")
      .getEditRowModel()
      .get("productId.code")
      .on("valueChange", function (data) {
        // 商品编码--值改变
        debugger;
      });
  viewModel.get("childs") &&
    viewModel.get("childs").getEditRowModel() &&
    viewModel.get("childs").getEditRowModel().get("productId.code") &&
    viewModel
      .get("childs")
      .getEditRowModel()
      .get("productId.code")
      .on("onAfterReferOkClick", function (data) {
        debugger;
      });
});