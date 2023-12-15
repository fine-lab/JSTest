viewModel.get("applyOrders") &&
  viewModel.get("applyOrders").getEditRowModel() &&
  viewModel.get("applyOrders").getEditRowModel().get("product.cCode") &&
  viewModel
    .get("applyOrders")
    .getEditRowModel()
    .get("product.cCode")
    .on("valueChange", function (data) {
      // 物料编码--值改变
      debugger;
      let pCode = viewModel.get("applyOrders").getEditRowModel().get("product.cCode");
    });