viewModel.get("yuangong_name") &&
  viewModel.get("yuangong_name").on("afterValueChange", function (data) {
    // 员工--值改变后
    viewModel.get("new6").setValue(data);
  });