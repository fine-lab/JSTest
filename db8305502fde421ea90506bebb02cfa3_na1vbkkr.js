viewModel.get("ywzz_name") &&
  viewModel.get("ywzz_name").on("afterValueChange", function (data) {
    // 业务组织--值改变后
    viewModel.get("money").setValue("2");
  });