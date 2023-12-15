viewModel.get("modelDescription") &&
  viewModel.get("modelDescription").on("afterValueChange", function (data) {
    // 规格说明--值改变后
    alert("值改变");
  });