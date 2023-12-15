viewModel.get("bl") &&
  viewModel.get("bl").on("afterValueChange", function (data) {
    // 业务类型--值改变后
  });
viewModel.get("bl") &&
  viewModel.get("bl").on("afterSelect", function (data) {
    // 业务类型--选择后
  });
viewModel.get("busMode_name") &&
  viewModel.get("busMode_name").on("afterReferOkClick", function (data) {
    // 业务模式--参照弹窗确认按钮点击后
  });