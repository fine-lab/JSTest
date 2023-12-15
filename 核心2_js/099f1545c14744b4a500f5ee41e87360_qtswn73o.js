viewModel.get("button1lf") &&
  viewModel.get("button1lf").on("click", function (data) {
    // 按钮--单击
    console.log(123);
  });
cb.rest.invokeFunction("", {}, function (err, res) {});