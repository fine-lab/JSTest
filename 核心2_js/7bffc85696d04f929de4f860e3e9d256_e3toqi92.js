viewModel.get("applyOrders") &&
  viewModel.get("applyOrders").getEditRowModel() &&
  viewModel.get("applyOrders").getEditRowModel().get("product.cCode") &&
  viewModel
    .get("applyOrders")
    .getEditRowModel()
    .get("product.cCode")
    .on("valueChange", function (data) {
      // 物料编码--值改变
      setTimeout(function () {
        console.log("物料编码--值改变->start");
      }, 1000);
    });
viewModel.on("customInit", function (data) {
  // 请购单--页面初始化
  const test = viewModel.get("fixedDataTableRowLayout_rowWrapper");
  console.log("----------");
  consloe.log(test);
  console.log("----------");
});
viewModel.get("applyOrders") &&
  viewModel.get("applyOrders").getEditRowModel() &&
  viewModel.get("applyOrders").getEditRowModel().get("product.cCode") &&
  viewModel
    .get("applyOrders")
    .getEditRowModel()
    .get("product.cCode")
    .on("blur", function (data) {
      // 物料编码--失去焦点的回调
      console.log("失去焦点的回调->start");
    });