viewModel.get("position") &&
  viewModel.get("position").on("afterValueChange", function (data) {
    // 詳細地址--值改变后
    alert(111);
  });