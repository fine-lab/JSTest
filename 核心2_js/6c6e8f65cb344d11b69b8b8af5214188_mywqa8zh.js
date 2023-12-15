viewModel.get("telphone") &&
  viewModel.get("telphone").on("afterValueChange", function (data) {
    // 手机号--值改变后
    debugger;
    var telphone = viewModel.get(telphone);
  });