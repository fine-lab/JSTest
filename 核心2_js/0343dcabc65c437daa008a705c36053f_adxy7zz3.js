viewModel.get("memo") &&
  viewModel.get("memo").on("afterValueChange", function (data) {
    // 备注--值改变后
    console.log("test ");
  });