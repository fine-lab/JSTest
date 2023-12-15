viewModel.get("emailSuffix") &&
  viewModel.get("emailSuffix").on("afterValueChange", function (data) {
    // 邮箱后缀--值改变后
    let email = viewModel.get("emailSuffix").getValue();
    if (!email) {
      email = "";
    }
    viewModel.get("emailSuffix_lc").setValue(email.toLowerCase());
  });