viewModel.get("button25pi") &&
  viewModel.get("button25pi").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("GT9037AT11.after.isHasLimi", {}, function (err, res) {});
  });