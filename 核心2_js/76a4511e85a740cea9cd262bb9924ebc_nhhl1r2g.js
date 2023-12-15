//复制后将是否转单设置为否
viewModel.on("afterCopy", function (args) {
  debugger;
  viewModel.get("headFreeItem!define11").setValue("false");
});