viewModel.get("zhuanjia") &&
  viewModel.get("zhuanjia").on("afterValueChange", function (data) {
    // 所属级别--值改变后
    const value = viewModel.get("zhuanjia").getValue();
    if (value == 1) {
      viewModel.get("pingfenquanzhong").setValue("20");
    } else if (value == 2) {
      viewModel.get("pingfenquanzhong").setValue("30");
    } else if (value == 3) {
      viewModel.get("pingfenquanzhong").setValue("50");
    }
  });